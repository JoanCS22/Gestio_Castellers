import {
    getCollesPlantilles, getCollesStructures, createPlantilla, modifyPlantilla,
} from "../services/plantillesService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaPlusSquare, FaSearch, FaTimesCircle, FaStar, FaPencilAlt
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import './Plantilles_Inici.css';
import TopMenu from "../components/TopMenu";

function PlantillesList() {
    const navigate = useNavigate();
    const { currentColla } = useColla();

    const permissions        = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [error, setError]           = useState("");
    const [message, setTempMessage]   = useState(null);
    const [plantilles, setPlantilles] = useState([]);
    const [estructures, setEstructures] = useState([]);
    const [selectedEstructures, setSelectedEstructures] = useState([]);
    const [openEstructures, setOpenEstructures] = useState(false);
    const [search, setSearch]         = useState("");

    const [showModal, setShowModal]   = useState(false);
    const [isModify, setIsModify]     = useState(false);
    const [currentPlantillaId, setCurrentPlantillaId] = useState(null);
    const [isNewStructure, setIsNewStructure] = useState(false);
    const [modalTags, setModalTags]   = useState({ nom: "", descripcio: "", estructura: "" });

    const [tronc,    setTronc]    = useState(true);
    const [pinya,    setPinya]    = useState(true);
    const [folre,    setFolre]    = useState(false);
    const [manilles, setManilles] = useState(false);
    const [puntals,  setPuntals]  = useState(false);

    const dropdownRef = useRef();

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const handleStructureChange = (value) => {
        setSelectedEstructures(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const resetModal = () => {
        setShowModal(false);
        setIsModify(false);
        setIsNewStructure(false);
        setCurrentPlantillaId(null);
        setModalTags({ nom: "", descripcio: "", estructura: "" });
        setError("");
    };

    const loadPlantilles = async () => {
        try { setPlantilles(await getCollesPlantilles(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadStructures = async () => {
        try { setEstructures(await getCollesStructures(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const createStructureCall = async () => {
        const required = { nom: "Nom", estructura: "Estructura" };
        for (const key in required) {
            if (!modalTags[key]?.toString().trim()) { setError(`El camp "${required[key]}" és obligatori`); return; }
        }
        if (!(tronc || pinya || folre || manilles || puntals)) {
            setError("Has de seleccionar almenys una secció"); return;
        }
        try {
            await createPlantilla(currentColla.id, modalTags, tronc, pinya, folre, manilles, puntals);
            await loadPlantilles();
            await loadStructures();
            resetModal();
            showTempMessage("Plantilla creada correctament.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const modifyPlantillaCall = async (idPlantilla, action, favoriteValue = false) => {
        try {
            await modifyPlantilla(idPlantilla, action, favoriteValue, modalTags);
            await loadPlantilles();
            resetModal();
            showTempMessage("Plantilla modificada.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    useEffect(() => { loadPlantilles(); loadStructures(); }, []);
    useEffect(() => { if (!pinya) setFolre(false); }, [pinya]);
    useEffect(() => { if (!folre) setManilles(false); }, [folre]);
    useEffect(() => { if (!manilles) setPuntals(false); }, [manilles]);

    // Tancar dropdown en click fora
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setOpenEstructures(false);
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    const filtered = plantilles.filter(p => {
        const searchOk = !search || p.nom?.toLowerCase().includes(search.toLowerCase()) || p.estructura?.toLowerCase().includes(search.toLowerCase());
        const estructuraOk = selectedEstructures.length === 0 || selectedEstructures.includes(p.estructura);
        return searchOk && estructuraOk;
    });

    return (
        <div>
            <TopMenu title="Plantilles colla" />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="plantilles-page">

                <div className="plantilles-toolbar">
                    <div className="plantilles-toolbar-left">

                        <div className="plantilles-search">
                            <FaSearch />
                            <input
                                type="search"
                                placeholder="Cercar plantilla..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>

                        <div className="estructures-dropdown" ref={dropdownRef}>
                            <span>Estructures:</span>
                            <button
                                className="estructures-trigger"
                                onClick={() => setOpenEstructures(o => !o)}
                            >
                                Seleccionats ({selectedEstructures.length}) ▾
                            </button>
                            {openEstructures && (
                                <div className="estructures-list">
                                    {estructures.map(item => (
                                        <label key={item.estructura}>
                                            <input
                                                type="checkbox"
                                                checked={selectedEstructures.includes(item.estructura)}
                                                onChange={() => handleStructureChange(item.estructura)}
                                            />
                                            {item.estructura}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {hasWritePermission("plantilles") && (
                        <button className="btn-add-plantilla" onClick={() => setShowModal(true)}>
                            <FaPlusSquare /> Afegir plantilla
                        </button>
                    )}
                </div>

                <div className="plantilles-grid">
                    {filtered.map(plantilla => (
                        <div
                            key={plantilla.id}
                            className="plantilla-bento"
                            onClick={() => navigate(`/plantilla_crear?id=${plantilla.id}`)}
                        >
                            <div className="plantilla-bento-header">
                                <div className="plantilla-bento-nom">{plantilla.nom}</div>
                                <div className="plantilla-bento-estructura">{plantilla.estructura}</div>
                            </div>

                            <div className="plantilla-bento-footer">
                                <button
                                    className={`btn-plantilla-icon btn-plantilla-icon--fav ${plantilla.favorita ? "active" : ""}`}
                                    title={plantilla.favorita ? "Treure de favorits" : "Afegir a favorits"}
                                    onClick={e => {
                                        e.stopPropagation();
                                        modifyPlantillaCall(plantilla.id, "favorite", !plantilla.favorita);
                                    }}
                                >
                                    <FaStar />
                                </button>
                                <button
                                    className="btn-plantilla-icon btn-plantilla-icon--edit"
                                    title="Modificar informació"
                                    onClick={e => {
                                        e.stopPropagation();
                                        setIsModify(true);
                                        setCurrentPlantillaId(plantilla.id);
                                        setModalTags({ nom: plantilla.nom, descripcio: plantilla.descripcio, estructura: plantilla.estructura });
                                        setShowModal(true);
                                    }}
                                >
                                    <FaPencilAlt />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay-plantilles">
                    <div className="modal-plantilles">
                        <h2>{isModify ? "Editar informació plantilla" : "Nova plantilla"}</h2>

                        <div className="modal-field">
                            <label>Nom</label>
                            <input
                                type="text"
                                placeholder="Nom de la plantilla"
                                value={modalTags.nom}
                                onChange={e => setModalTags({ ...modalTags, nom: e.target.value })}
                            />
                        </div>

                        <div className="modal-field">
                            <label>Estructura</label>
                            <select
                                value={isNewStructure ? "nova" : modalTags.estructura}
                                onChange={e => {
                                    const v = e.target.value;
                                    if (v === "nova") { setIsNewStructure(true); setModalTags({ ...modalTags, estructura: "" }); }
                                    else { setIsNewStructure(false); setModalTags({ ...modalTags, estructura: v }); }
                                }}
                            >
                                <option value="">Selecciona una estructura</option>
                                {estructures.map(item => (
                                    <option key={item.estructura} value={item.estructura}>{item.estructura}</option>
                                ))}
                                <option value="nova">+ Nova estructura</option>
                            </select>
                            {isNewStructure && (
                                <input
                                    type="text"
                                    placeholder="Nom nova estructura"
                                    value={modalTags.estructura}
                                    onChange={e => setModalTags({ ...modalTags, estructura: e.target.value })}
                                    style={{ marginTop: "var(--space-xs)" }}
                                />
                            )}
                        </div>

                        <div className="modal-field">
                            <label>Descripció</label>
                            <textarea
                                placeholder="Descripció de la plantilla..."
                                value={modalTags.descripcio}
                                onChange={e => setModalTags({ ...modalTags, descripcio: e.target.value })}
                            />
                        </div>

                        {!isModify && (
                            <div className="modal-checks-row">
                                {[
                                    { key: "tronc",    label: "Tronc",    val: tronc,    set: setTronc,    disabled: false },
                                    { key: "pinya",    label: "Pinya",    val: pinya,    set: setPinya,    disabled: false },
                                    { key: "folre",    label: "Folre",    val: folre,    set: setFolre,    disabled: !pinya },
                                    { key: "manilles", label: "Manilles", val: manilles, set: setManilles, disabled: !folre },
                                    { key: "puntals",  label: "Puntals",  val: puntals,  set: setPuntals,  disabled: !manilles },
                                ].map(({ key, label, val, set, disabled }) => (
                                    <div key={key} className="modal-check-item">
                                        <span>{label}</span>
                                        <input
                                            type="checkbox"
                                            checked={val}
                                            disabled={disabled}
                                            onChange={e => set(e.target.checked)}
                                        />
                                    </div>
                                ))}
                            </div>
                        )}

                        {error && <div className="error-message">{error}</div>}

                        <div className="modal-buttons-plantilles">
                            <button
                                style={{
                                    display:"inline-flex", alignItems:"center", gap:"var(--space-sm)",
                                    padding:"var(--space-sm) var(--space-md)",
                                    background:"var(--surface-container-high)", color:"var(--on-surface)",
                                    border:"none", borderRadius:"var(--radius-md)",
                                    fontFamily:"var(--font-base)", fontSize:"var(--text-label-md)", fontWeight:700,
                                    cursor:"pointer"
                                }}
                                onClick={resetModal}
                            >
                                <FaTimesCircle /> Cancel·lar
                            </button>
                            <button
                                style={{
                                    display:"inline-flex", alignItems:"center", gap:"var(--space-sm)",
                                    padding:"var(--space-sm) var(--space-md)",
                                    background:"var(--primary)", color:"var(--on-primary)",
                                    border:"none", borderRadius:"var(--radius-md)",
                                    fontFamily:"var(--font-base)", fontSize:"var(--text-label-md)", fontWeight:700,
                                    cursor:"pointer", boxShadow:"var(--shadow-sm)"
                                }}
                                onClick={isModify ? () => modifyPlantillaCall(currentPlantillaId, false) : createStructureCall}
                            >
                                {isModify ? <><FaPencilAlt /> Modificar</> : <><FaPlusSquare /> Afegir plantilla</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default PlantillesList;