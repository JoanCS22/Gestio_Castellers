import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare, FaTimesCircle,
    FaRegStar, FaPencilAlt, FaTrashAlt
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import './Plantilles_Inici.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";
import Input from "../components/Input";

function PlantillesList() {
    const navigate = useNavigate();

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

    const getCollesPlantilles = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/plantilles/getPlantillesByColla?id=${idColla}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            setPlantilles(data);
            console.log("{DEBUG} Get colla's plantilles OK")
        } else {
            console.log("{DEBUG} Get colla's plantilles KO")
            setError(data.message);
        }
    }

    const getCollesStructures = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/plantilles/getEstructuresByColla?id=${idColla}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            setEstructures(data);
            console.log("{DEBUG} Get colla's structures OK")
        } else {
            console.log("{DEBUG} Get colla's structures KO")
            setError(data.message);
        }
    }

    const createPlantilla = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

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

        const response = await fetch(`http://localhost:5000/plantilles/createPlantilla?id=${idColla}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: modalTags.nom,
                descripcio: modalTags.descripcio,
                estructura: modalTags.estructura,
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Create plantilla OK");

            await getCollesPlantilles();
            await getCollesStructures();

            resetModal();
            showTempMessage("Plantilla creada correctament.");
        } else {
            console.log("{DEBUG} Create plantilla KO");
            setError(data.message);
        }
    }

    const modifyInfoPlantilla = async (idPlantilla, action, favoriteValue = false) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/plantilles/modifyInfoPlantilla?id=${idPlantilla}&action=${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                descripcio: modalTags.descripcio,
                estructura: modalTags.estructura,
                favorita: favoriteValue
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify plantilla OK");

            await getCollesPlantilles();

            resetModal();
            showTempMessage("Plantilla modificada.");
        } else {
            console.log("{DEBUG} Modify plantilla KO");
            setError(data.message);
        }
    }

    useEffect(() => {
        getCollesPlantilles();
        getCollesStructures();
    }, []);

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
                        <div className="container-plantilla-text" onClick={() =>
                            navigate(`/plantilla_crear?idPlantilla=${plantilla.id}&nomPlantilla=${plantilla.nom}`)
                        }>
                            <span>{plantilla.nom}</span>
                            <span>{plantilla.estructura}</span>
                        </div>
                        <div className="container-plantilla-icons">
                            <FaRegStar title="Afegir a favorits" className={plantilla.favorita ? "favorit-actiu" : ""} onClick={() => {
                                modifyInfoPlantilla(plantilla.id, "favorite", !plantilla.favorita)
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
                            {"Nova plantilla"}
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
                                readOnly={isModify}
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
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
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
                        <div className="modal-buttons-plantilles">

                            {!isModify ? (
                                <>
                                    <Button
                                        text={"Afegir plantilla"}
                                        icon={<FaPlusSquare />}
                                        action={createPlantilla}
                                    />
                                </>
                            ) : (
                                <>
                                    <Button
                                        text={"Modificar informació"}
                                        icon={<FaPencilAlt />}
                                        action={() => { modifyInfoPlantilla(currentPlantillaId, false) }}
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
            )}
        </div>
    )
}

export default PlantillesList;