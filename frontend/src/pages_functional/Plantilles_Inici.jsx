import {
    getCollesPlantilles, getCollesStructures, createPlantilla, modifyPlantilla,
} from "../services/plantillesService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare, FaTimesCircle,
    FaStar, FaPencilAlt, FaTrashAlt
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import { useColla } from "../context/CollaContext.jsx";

import './Plantilles_Inici.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";
import Input from "../components/Input";

function PlantillesList() {
    const navigate = useNavigate();

    const { currentColla, loadingColles } = useColla();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);

    const [plantilles, setPlantilles] = useState([]);

    const [estructures, setEstructures] = useState([]);
    const [selectedEstructures, setSelectedEstructures] = useState([]);
    const [openEstructures, setOpenEstructures] = useState(false);

    const [showModalAddPlantilla, setShowModalAddPlantilla] = useState(false);
    const [modalTags, setModalTags] = useState({
        nom: "",
        descripcio: "",
        estructura: ""
    });
    const [searchResults, setSearchResults] = useState([]);

    const [isNewStructure, setIsNewStructure] = useState(false);

    const [isModify, setIsModify] = useState(false);

    const [currentPlantillaId, setCurrentPlantillaId] = useState(false);

    const [tronc, setTronc] = useState(true);
    const [pinya, setPinya] = useState(true);
    const [folre, setFolre] = useState(false);
    const [manilles, setManilles] = useState(false);
    const [puntals, setPuntals] = useState(false);

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
        setShowModalAddPlantilla(false);
        setIsModify(false);
        setIsNewStructure(false);
        setCurrentPlantillaId(null);

        setModalTags({
            nom: "",
            descripcio: "",
            estructura: ""
        });

        setError("");
    };

    const loadPlantilles = async () => {
        try {
            const data = await getCollesPlantilles(currentColla.id);
            setPlantilles(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadStructures = async () => {
        try {
            const data = await getCollesStructures(currentColla.id);
            setEstructures(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const createStructureCall = async () => {
        const compulsoryInputs = {
            nom: "Nom",
            estructura: "Estructura",
        };
        for (const key in compulsoryInputs) {
            if (!modalTags[key] || modalTags[key].toString().trim() === "") {
                setError(`El camp ${compulsoryInputs[key]} és obligatori`);
                return;
            }
        }
        const hasAnySectionSelected =
            tronc || pinya || folre || manilles || puntals;
        if (!hasAnySectionSelected) {
            setError("Has de seleccionar almenys una secció");
            return;
        }

        try {
            const data = await createPlantilla(currentColla.id, modalTags, tronc, pinya, folre, manilles, puntals);
            await loadPlantilles();
            await loadStructures();
            resetModal();
            showTempMessage("Plantilla creada correctament.");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const modifyPlantillaCall = async (idPlantilla, action, favoriteValue = false) => {
        try {
            const data = await modifyPlantilla(idPlantilla, action, favoriteValue, modalTags);
            await loadPlantilles();
            resetModal();
            showTempMessage("Plantilla modificada.");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        loadPlantilles();
        loadStructures();
    }, []);

    useEffect(() => {
        if (!pinya) {
            setFolre(false);
        }
    }, [pinya]);

    useEffect(() => {
        if (!folre) {
            setManilles(false);
        }
    }, [folre]);

    useEffect(() => {
        if (!manilles) {
            setPuntals(false);
        }
    }, [manilles]);

    return (
        <div>
            <TopMenu
                title='Plantilles colla'
            />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            <div className="button-add-plantilles">
                <>
                    {hasWritePermission("plantilles") && (
                        <Button
                            text='Afegir plantilla'
                            icon={<FaPlusSquare />}
                            action={() => {
                                setShowModalAddPlantilla(true);
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
            <div className="grid-plantilla-list">
                {plantilles.map((plantilla) => (
                    <div className="container-plantilla">
                        <div className="container-plantilla-text" onClick={() => {
                            navigate(`/plantilla_crear?id=${plantilla.id}`)
                        }}>
                            <span>{plantilla.nom}</span>
                            <span>{plantilla.estructura}</span>
                        </div>
                        <div className="container-plantilla-icons">
                            <FaStar title="Afegir a favorits" className={plantilla.favorita ? "favorit-actiu" : ""} onClick={() => {
                                modifyPlantillaCall(plantilla.id, "favorite", !plantilla.favorita)
                            }} />
                            <FaPencilAlt title="Modificar informació" onClick={() => {
                                setIsModify(true);
                                setCurrentPlantillaId(plantilla.id);
                                setModalTags({
                                    nom: plantilla.nom,
                                    descripcio: plantilla.descripcio,
                                    estructura: plantilla.estructura
                                });
                                setShowModalAddPlantilla(true);
                            }} />
                        </div>
                    </div>
                ))}
            </div>
            {showModalAddPlantilla && (
                <div className="modal-overlay-plantilles">
                    <div className="modal-plantilles">
                        <h2>
                            {!isModify ? "Nova plantilla" : "Editar informació plantilla"}
                        </h2>
                        <div className="input-group-plantilles">
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
                            <div className="estructura-selector-plantilles">

                                <label>Estructura</label>
                                <select
                                    value={isNewStructure ? "nova" : modalTags.estructura}
                                    onChange={(e) => {
                                        const value = e.target.value;

                                        if (value === "nova") {
                                            setIsNewStructure(true);
                                            setModalTags({ ...modalTags, estructura: "" });
                                        } else {
                                            setIsNewStructure(false);
                                            setModalTags({ ...modalTags, estructura: value });
                                        }
                                    }}
                                >
                                    <option value="">Selecciona una estructura</option>

                                    {estructures.map((item) => (
                                        <option key={item.estructura} value={item.estructura}>
                                            {item.estructura}
                                        </option>
                                    ))}

                                    <option value="nova">+ Nova estructura</option>
                                </select>

                                {isNewStructure && (
                                    <Input
                                        name="nova_estructura"
                                        type="text"
                                        placeholder="Nom nova estructura"
                                        value={modalTags.estructura}
                                        onChange={(e) =>
                                            setModalTags({ ...modalTags, estructura: e.target.value })
                                        }
                                        inputTitle="Nova estructura"
                                    />
                                )}
                            </div>
                        </div>
                        <div>Descripció</div>
                        <div className="input-group-plantilles">
                            <textarea
                                placeholder="Descripció"
                                value={modalTags.descripcio}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, descripcio: e.target.value })
                                }
                            />
                        </div>
                        {!isModify && (
                            <>
                                <div className="modal-checkboxes-plantilles">

                                    <div className="checkbox-item-plantilles">
                                        <span>Tronc</span>
                                        <input
                                            type="checkbox"
                                            checked={tronc}
                                            onChange={(e) => setTronc(e.target.checked)}
                                        />
                                    </div>

                                    <div className="checkbox-item-plantilles">
                                        <span>Pinya</span>
                                        <input
                                            type="checkbox"
                                            checked={pinya}
                                            onChange={(e) => setPinya(e.target.checked)}
                                        />
                                    </div>

                                    <div className="checkbox-item-plantilles">
                                        <span>Folre</span>
                                        <input
                                            type="checkbox"
                                            checked={folre}
                                            disabled={!pinya}
                                            onChange={(e) => setFolre(e.target.checked)}
                                        />
                                    </div>

                                    <div className="checkbox-item-plantilles">
                                        <span>Manilles</span>
                                        <input
                                            type="checkbox"
                                            checked={manilles}
                                            disabled={!folre}
                                            onChange={(e) => setManilles(e.target.checked)}
                                        />
                                    </div>

                                    <div className="checkbox-item-plantilles">
                                        <span>Puntals</span>
                                        <input
                                            type="checkbox"
                                            checked={puntals}
                                            disabled={!manilles}
                                            onChange={(e) => setPuntals(e.target.checked)}
                                        />
                                    </div>

                                </div>
                            </>
                        )}
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        <div className="modal-buttons-plantilles">

                            {!isModify ? (
                                <>
                                    <Button
                                        text={"Afegir plantilla"}
                                        icon={<FaPlusSquare />}
                                        action={createStructureCall}
                                    />
                                </>
                            ) : (
                                <>
                                    <Button
                                        text={"Modificar informació"}
                                        icon={<FaPencilAlt />}
                                        action={() => { modifyPlantillaCall(currentPlantillaId, false) }}
                                    />
                                </>
                            )}


                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => { resetModal(); }}
                            />
                        </div>
                    </div>
                </div>
            )
            }
        </div >
    )
}

export default PlantillesList;