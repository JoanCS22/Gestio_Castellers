import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare, FaTimesCircle } from "react-icons/fa";

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
                            {estructures.map(estructura => (
                                <label key={estructura}>
                                    <input
                                        type="checkbox"
                                        checked={selectedEstructures.includes(estructura)}
                                        onChange={() => handleStructureChange(estructura)}
                                    />
                                    {estructura}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
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

                                    {estructures.map((estructura) => (
                                        <option key={estructura} value={estructura}>
                                            {estructura}
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

                            <Button
                                text={"Afegir plantilla"}
                                icon={<FaPlusSquare />}
                                action={() => { }} />

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => { setShowModalAddPlantilla(false); setError(""); }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default PlantillesList;