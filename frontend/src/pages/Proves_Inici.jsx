import {
    getCollesPlantilles, getCollesStructures,
} from "../services/plantillesService.js";
import {
    getProvesByEsdeveniment, createProva, updateFavorite, updateFeta
} from "../services/provesService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaPlusSquare, FaClipboardList, FaSearch, FaTimesCircle,
    FaCheckCircle, FaHashtag, FaStar, FaPlus, FaClock
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import TopMenu from "../components/TopMenu.jsx";

import "./Proves_Inici.css";

function ProvesInici() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentColla } = useColla();

    const params = new URLSearchParams(location.search);
    const idEsdeveniment = params.get("idEsdeveniment");
    const nomEsdeveniment = params.get("nomEsdeveniment");

    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasAccess = (key) => permissions[key] !== "X";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");
    const [proves, setProves] = useState([]);
    const [plantilles, setPlantilles] = useState([]);
    const [estructures, setEstructures] = useState([]);
    const [selectedEstructures, setSelectedEstructures] = useState([]);
    const [openEstructures, setOpenEstructures] = useState(false);
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedPlantilla, setSelectedPlantilla] = useState("");
    const [modalTags, setModalTags] = useState({
        nom: "", comentari: "", estructura: "", xarxa: false, public: false
    });

    const dropdownRef = useRef();

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const resetModal = () => {
        setShowModal(false);
        setSelectedPlantilla("");
        setModalTags({ nom: "", comentari: "", estructura: "", xarxa: false, public: false });
        setError("");
    };

    const handleStructureChange = (value) => {
        setSelectedEstructures(prev =>
            prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
        );
    };

    const changeState = (valorActual) => {
        if (valorActual === "per fer") return "feta";
        if (valorActual === "feta") return "cancelada";
        if (valorActual === "cancelada") return "per fer";
        return "per fer";
    };

    const loadProves = async () => {
        try { setProves(await getProvesByEsdeveniment(idEsdeveniment)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadPlantilles = async () => {
        try { setPlantilles(await getCollesPlantilles(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadStructures = async () => {
        try { setEstructures(await getCollesStructures(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const createProvaCall = async () => {
        const required = { nom: "Nom", estructura: "Estructura" };
        for (const key in required) {
            if (!modalTags[key]?.toString().trim()) {
                setError(`El camp "${required[key]}" és obligatori`); return;
            }
        }
        if (!selectedPlantilla) { setError("El camp Plantilla és obligatori"); return; }
        try {
            await createProva(idEsdeveniment, modalTags, selectedPlantilla);
            await loadProves();
            resetModal();
            showTempMessage("Prova creada correctament.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const changeFavorite = async (id, val) => {
        try { await updateFavorite(id, val); await loadProves(); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const changeFeta = async (id, val) => {
        try {
            const newValue = changeState(val);
            await updateFeta(id, newValue);
            await loadProves();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    // Tancar dropdown en click fora
    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setOpenEstructures(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        loadProves();
        loadPlantilles();
        loadStructures();
    }, []);

    // Filtratge local
    const filtered = proves.filter(p => {
        if (!(hasAccess("proves") || p.public)) return false;
        if (selectedEstructures.length > 0 && !selectedEstructures.includes(p.estructura)) return false;
        if (search) {
            const s = search.toLowerCase();
            if (!p.nom?.toLowerCase().includes(s) && !p.estructura?.toLowerCase().includes(s)) return false;
        }
        return true;
    });

    const navigateToProva = (prova) => {
        const base = hasWritePermission("proves") ? "/proves_board_edit" : "/proves_board_show";
        navigate(`${base}?id=${prova.id}&idEsdeveniment=${idEsdeveniment}&nomEsdeveniment=${encodeURIComponent(nomEsdeveniment)}`);
    };

    return (
        <div>
            <TopMenu title={`Proves ${nomEsdeveniment}`} tornar />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="proves-page">

                <div className="proves-toolbar">
                    <div className="proves-toolbar-left">

                        <div className="proves-search">
                            <FaSearch />
                            <input
                                type="search"
                                placeholder="Cercar prova..."
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

                    <div className="proves-toolbar-right">
                        {hasAccess("proves") && (
                            <button
                                className="btn-proves-secondary"
                                onClick={() => navigate(`/proves_llistat?idEsdeveniment=${idEsdeveniment}&nomEsdeveniment=${encodeURIComponent(nomEsdeveniment)}`)}
                            >
                                <FaClipboardList /> Llistat de proves
                            </button>
                        )}
                        {hasWritePermission("proves") && (
                            <button
                                className="btn-proves-primary"
                                onClick={() => setShowModal(true)}
                            >
                                <FaPlusSquare /> Afegir prova
                            </button>
                        )}
                    </div>
                </div>

                <div className="proves-grid">
                    {filtered.map(prova => (
                        <div key={prova.id} className="prova-bento">
                            <div className="prova-bento-header" onClick={() => navigateToProva(prova)}>
                                <div className="prova-bento-tag">
                                    <span className="prova-bento-dot" />
                                    <span className="prova-bento-tag-text">{prova.estructura || "—"}</span>
                                </div>
                                <h3 className="prova-bento-nom">{prova.nom}</h3>
                                {prova.comentari && (
                                    <p className="prova-bento-estructura">{prova.comentari}</p>
                                )}
                            </div>

                            <div className="prova-bento-footer">
                                <div className="prova-bento-badges">
                                    {prova.xarxa && (
                                        <span className="prova-badge prova-badge--xarxa">
                                            <FaHashtag /> Xarxa
                                        </span>
                                    )}
                                    {prova.feta == "feta" ? (
                                        <span
                                            className="prova-badge prova-badge--feta"
                                            title="Prova feta"
                                            onClick={() => changeFeta(prova.id, prova.feta)}
                                            style={{ cursor: "pointer" }}
                                        >
                                            <FaCheckCircle /> Completada
                                        </span>
                                    ) : (
                                        <>
                                            {prova.feta == "cancelada" ? (
                                                <span
                                                    className="prova-badge prova-badge--cancelada"
                                                    title="Prova cancelada"
                                                    onClick={() => changeFeta(prova.id, prova.feta)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <FaCheckCircle /> Cancelada
                                                </span>
                                            ) : (
                                                <span
                                                    className="prova-badge prova-badge--pendent"
                                                    title="Prova pendent de fer"
                                                    onClick={() => changeFeta(prova.id, prova.feta)}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    <FaClock /> Pendent
                                                </span>
                                            )}
                                        </>
                                    )}
                                </div>

                                <button
                                    className={`btn-favorit ${prova.favorita ? "btn-favorit--actiu" : ""}`}
                                    title={prova.favorita ? "Treure de favorits" : "Afegir a favorits"}
                                    onClick={() => changeFavorite(prova.id, !prova.favorita)}
                                >
                                    <FaStar />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay-proves">
                    <div className="modal-proves">
                        <h2>Nova prova</h2>

                        <div className="modal-fields-row">
                            <div className="modal-field">
                                <label>Nom</label>
                                <input type="text" placeholder="Nom de la prova"
                                    value={modalTags.nom}
                                    onChange={e => setModalTags({ ...modalTags, nom: e.target.value })} />
                            </div>
                            <div className="modal-field">
                                <label>Estructura</label>
                                <input type="text" placeholder="Ex: 3de8"
                                    value={modalTags.estructura}
                                    onChange={e => setModalTags({ ...modalTags, estructura: e.target.value })} />
                            </div>
                        </div>

                        <div className="modal-field">
                            <label>Comentari</label>
                            <textarea placeholder="Observacions, detalls tècnics..."
                                value={modalTags.comentari}
                                onChange={e => setModalTags({ ...modalTags, comentari: e.target.value })} />
                        </div>

                        <div className="modal-field">
                            <label>Plantilla</label>
                            <select value={selectedPlantilla}
                                onChange={e => setSelectedPlantilla(e.target.value)}>
                                <option value="">Selecciona plantilla</option>
                                {plantilles.map(r => (
                                    <option key={r.id} value={String(r.id)}>{r.nom}</option>
                                ))}
                            </select>
                        </div>

                        <div className="modal-checks-row">
                            <label className="modal-check-item">
                                <input type="checkbox" checked={modalTags.xarxa}
                                    onChange={e => setModalTags({ ...modalTags, xarxa: e.target.checked })} />
                                Xarxa
                            </label>
                            <label className="modal-check-item">
                                <input type="checkbox" checked={modalTags.public}
                                    onChange={e => setModalTags({ ...modalTags, public: e.target.checked })} />
                                Públic
                            </label>
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="modal-buttons-proves">
                            <button className="btn-proves-secondary" onClick={resetModal}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                            <button className="btn-proves-primary" onClick={createProvaCall}>
                                <FaPlusSquare /> Crear prova
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProvesInici;