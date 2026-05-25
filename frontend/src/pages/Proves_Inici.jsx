import {
    getCollesPlantilles, getCollesStructures,
} from "../services/plantillesService.js";
import {
    getProvesByEsdeveniment, createProva, updateFavorite, updateFeta
} from "../services/provesService.js";
import { handleApiError } from "../utils/handleApiError.js";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaPlusSquare, FaClipboardList, FaSearch, FaTimesCircle, FaCheckCircle, FaHashtag,
    FaRegStar
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import "./Proves_Inici.css"

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";
import Input from "../components/Input.jsx";

import { useSyncExternalStore } from "react";

function ProvesInici() {

    const navigate = useNavigate();

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const idEsdeveniment = params.get("idEsdeveniment");
    const nomEsdeveniment = params.get("nomEsdeveniment");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasAccess = (key) => permissions[key] !== "X";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [estructures, setEstructures] = useState([]);
    const [selectedEstructures, setSelectedEstructures] = useState([]);
    const [openEstructures, setOpenEstructures] = useState(false);

    const [showModalAddProva, setShowModalAddProva] = useState(false);
    const [modalTags, setModalTags] = useState({
        nom: "",
        comentari: "",
        estructura: "",
        xarxa: false,
        public: false
    });
    const [selectedPlantilla, setSelectedPlantilla] = useState("");

    const [searchResults, setSearchResults] = useState([]);

    const [plantilles, setPlantilles] = useState([]);
    const [proves, setProves] = useState([]);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const handleStructureChange = (value) => {
        setSelectedEstructures(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const resetModal = () => {
        setShowModalAddProva(false);
        setSelectedPlantilla("");

        setModalTags({
            nom: "",
            descripcio: "",
            estructura: "",
            xarxa: false,
            public: false,
        });

        setError("");
    };

    const loadPlantilles = async () => {
        try {
            const data = await getCollesPlantilles();
            setPlantilles(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadStructures = async () => {
        try {
            const data = await getCollesStructures();
            setEstructures(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadProvesByEsdeveniment = async () => {
        try {
            const data = await getProvesByEsdeveniment(idEsdeveniment);
            setProves(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const createProvaCall = async (action) => {
        const compulsoryInputs = {
            nom: "Nom",
            estructura: "Estructura"
        };
        for (const key in compulsoryInputs) {
            if (!modalTags[key] || modalTags[key].toString().trim() === "") {
                setError(`El camp ${compulsoryInputs[key]} és obligatori`);
                return;
            }
        }
        if (!selectedPlantilla) {
            setError("El camp Plantilla és obligatori");
            return;
        }

        try {
            const data = await createProva(idEsdeveniment, modalTags, selectedPlantilla);
            await loadProvesByEsdeveniment();
            resetModal();
            showTempMessage("Prova creada correctament.");
            resetModal();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const changeFavorite = async (idPlantilla, favoriteValue) => {
        try {
            const data = await updateFavorite(idPlantilla, favoriteValue);
            await loadProvesByEsdeveniment();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const changeFeta = async (idPlantilla, fetaValue) => {
        try {
            const data = await updateFeta(idPlantilla, fetaValue);
            await loadProvesByEsdeveniment();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        loadStructures();
        loadProvesByEsdeveniment();
        loadPlantilles();
    }, []);

    return (
        <div>
            <TopMenu
                title={`Proves ${nomEsdeveniment}`}
            />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            <div className="button-section-proves">
                <>
                    {hasWritePermission("proves") && (
                        <Button
                            text='Afegir prova'
                            icon={<FaPlusSquare />}
                            action={() => {
                                setShowModalAddProva(true);
                            }}
                        />
                    )}
                    {hasAccess("proves") && (
                        <Button
                            text='Llistat de proves'
                            icon={<FaClipboardList />}
                            action={() => {
                                setShowModalAddProva(false);
                                navigate(`/proves_llistat?idEsdeveniment=${idEsdeveniment}&nomEsdeveniment=${encodeURIComponent(nomEsdeveniment)}`);
                            }}
                        />
                    )}
                </>
            </div>
            <div className="filtres-plantilles">
                <div className="search-tab-plantilles">
                    <span>Cercar:</span>
                    <FaSearch />
                    <input type='search' placeholder='Cercar...'></input>
                </div>
                <div className="dropdown-estructures-plantilles">
                    <span>Estructures:</span>
                    <button onClick={() => setOpenEstructures(!openEstructures)}>
                        Seleccionats ({selectedEstructures.length}) ▾
                    </button>
                    {openEstructures && (
                        <div className="dropdown-content-estructures-plantilles">
                            {estructures.map((item) => (
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
            <div className="grid-proves-list">
                {proves.map((prova) => (
                    (hasAccess("proves") || prova.public) && (
                        <>
                            <div className="container-proves">
                                <div className="container-proves-text" onClick={() => {
                                    if (hasWritePermission("proves")) {
                                        navigate(`/proves_board_edit?id=${prova.id}&idEsdeveniment=${idEsdeveniment}&nomEsdeveniment=${encodeURIComponent(nomEsdeveniment)}`)
                                    } else {
                                        navigate(`/proves_board_show?id=${prova.id}&idEsdeveniment=${idEsdeveniment}&nomEsdeveniment=${encodeURIComponent(nomEsdeveniment)}`)
                                    }
                                }}>
                                    <span>{prova.nom}</span>
                                    <span>{prova.estructura}</span>
                                </div>
                                <div className="container-proves-icons">
                                    {prova.xarxa && (
                                        <>
                                            <FaHashtag className="icon-xarxa" title="Xarxa" />
                                        </>
                                    )}
                                    {prova.feta ? (
                                        <>
                                            <FaCheckCircle title="No realitzada?" className="icon-feta"
                                                onClick={() => {
                                                    changeFeta(prova.id, false);
                                                }} />
                                        </>
                                    ) : (
                                        <>
                                            <FaTimesCircle title="Realitzada?" className="icon-no-feta"
                                                onClick={() => {
                                                    changeFeta(prova.id, true);
                                                }} />
                                        </>
                                    )}
                                    <FaRegStar title={prova.favorita ? "Treure de favorits" : "Afegir a favorits"} className={`icon-favorit ${prova.favorita ? "favorit-actiu" : ""}`}
                                        onClick={() => {
                                            changeFavorite(prova.id, !prova.favorita);
                                        }} />
                                </div>
                            </div>
                        </>
                    )
                ))}
            </div>
            {showModalAddProva && (
                <div className="modal-overlay-proves">
                    <div className="modal-proves">
                        <h2>
                            {"Nova prova"}
                        </h2>
                        <div className="input-group-proves">
                            <Input
                                name="name"
                                type="text"
                                placeholder="Nom"
                                value={modalTags.nom}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, nom: e.target.value })
                                }
                                inputTitle="Nom"
                            />
                            <Input
                                name="estructura"
                                type="text"
                                placeholder="Estructura"
                                value={modalTags.estructura}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, estructura: e.target.value })
                                }
                                inputTitle="Estructura"
                            />
                        </div>
                        <div>Comentari</div>
                        <div className="input-group-proves">
                            <textarea
                                placeholder="Comentari"
                                value={modalTags.comentari}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, comentari: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-checkboxes-proves">

                            <div className="input-item-proves">
                                <label className="field-prova-plantilla">Plantilla</label>
                                <div className="select-wrapper-plantilla">
                                    <select
                                        value={selectedPlantilla}
                                        onChange={(e) => setSelectedPlantilla(e.target.value)}
                                        className="custom-select-prova-plantilla"
                                    >
                                        <option value="">Selecciona plantilla</option>

                                        {plantilles.map(r => (
                                            <option key={r.id} value={String(r.id)}>
                                                {r.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="checkbox-item-proves">
                                <span>Xarxa</span>
                                <input
                                    type="checkbox"
                                    checked={modalTags.xarxa}
                                    onChange={(e) => setModalTags({ ...modalTags, xarxa: e.target.checked })}
                                />
                            </div>

                            <div className="checkbox-item-proves">
                                <span>Públic?</span>
                                <input
                                    type="checkbox"
                                    checked={modalTags.public}
                                    onChange={(e) => setModalTags({ ...modalTags, public: e.target.checked })}
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        <div className="modal-buttons-proves">

                            <Button
                                text={"Crear prova"}
                                icon={<FaPlusSquare />}
                                action={createProvaCall}
                            />

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => { resetModal(); }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProvesInici;