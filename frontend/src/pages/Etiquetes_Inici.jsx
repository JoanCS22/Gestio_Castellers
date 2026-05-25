import {
    getCollesPositions, createPosicio, updatePosicio, deletePosicio,
    getCollesRoles, createRoles, updateRoles, deleteRoles,
} from "../services/collaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch, FaSave, FaTimesCircle, FaTrashAlt, FaPencilAlt, FaRegEye } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import './Etiquetes_Inici.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";
import Input from "../components/Input";
import PermisoSelector from "../components/PermisoSelector";

function Etiquetes() {

    const location = useLocation();
    const navigate = useNavigate();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const hasAccess = (key) => permissions[key] !== "X";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [selectedTag, setSelectedTag] = useState("posicions");

    const [positions, setPositions] = useState([]);
    const [rols, setRols] = useState([]);

    const [showModalPosicions, setShowModalPosicions] = useState(false);
    const [showModalRols, setShowModalRols] = useState(false);

    const [newPositionTag, setNewPositionTag] = useState({
        nom: "",
        descripcio: "",
        color: "#FFFFFF"
    });
    const [newRoleTag, setNewRoleTag] = useState({
        nom: "",
        descripcio: "",
    });

    const defaultPermisos = {
        esdeveniments: "X",
        proves: "X",
        plantilles: "X",
        assistencia: "X",
        notificacions: "X",
        colla: "X",
        permisos: "X",
        membres: "X",
        llistats: "X"
    };

    const [permisos, setPermisos] = useState(defaultPermisos);

    const [isCreate, setCreate] = useState(true);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [currentRole, setCurrentRole] = useState(null);

    const isPosition = selectedTag === "posicions";
    const isRole = selectedTag === "rols";

    const updatePermiso = (key, value) => {
        setPermisos(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetPermisos = () => setPermisos(defaultPermisos);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const loadCollesPositions = async () => {
        try {
            const data = await getCollesPositions();
            setPositions(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const createPosicioCall = async () => {
        if (newPositionTag.nom == "") {
            setError(`El camp nom no pot estar buit`);
            return;
        }
        try {
            const data = await createPosicio(newPositionTag);
            setError("");
            setShowModalPosicions(false);
            setNewPositionTag({ nom: "", descripcio: "" });
            showTempMessage("Posició creada correctament.");
            loadCollesPositions();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const updatePosicioCall = async () => {
        if (!currentPosition) return;
        try {
            const data = await updatePosicio(currentPosition, newPositionTag);
            setError("");
            setShowModalPosicions(false);
            setNewPositionTag({ nom: "", descripcio: "", color: "#FFFFFF" });
            showTempMessage("Posició modificada correctament.");
            loadCollesPositions();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const deletePosicioCall = async (idPosicio) => {
        if (!window.confirm("Segur que vols eliminar aquesta posició?")) return;
        try {
            const data = await deletePosicio(idPosicio);
            setError("");
            showTempMessage("Posició eliminada correctament.");
            loadCollesPositions();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadCollesRoles = async () => {
        try {
            const data = await getCollesRoles();
            setRols(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const createPosicioRoles = async () => {
        if (newRoleTag.nom == "") {
            setError(`El camp nom no pot estar buit`);
            return;
        }
        try {
            const data = await createRoles(newRoleTag, permisos);
            setError("");
            setShowModalRols(false);
            setNewRoleTag({ nom: "", descripcio: "" });
            showTempMessage("Rol creat correctament.");
            resetPermisos();
            loadCollesRoles();
            loadCollesPositions();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const updatePosicioRoles = async (idRol) => {
        if (!currentRole) return;
        try {
            const data = await updateRoles(idRol, newRoleTag, permisos);
            setError("");
            setShowModalRols(false);
            setNewRoleTag({ nom: "", descripcio: "" });
            resetPermisos();
            showTempMessage("Rol modificat correctament.");
            loadCollesRoles();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const deletePosicioRoles = async (idRol) => {
        if (!window.confirm("Segur que vols eliminar aquest rol?")) return;
        try {
            const data = await deleteRoles(idRol);
            setError("");
            showTempMessage("Rol eliminat correctament.");
            loadCollesRoles();
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        loadCollesPositions();
    }, []);

    return (
        <div>
            <TopMenu
                title={isPosition ? 'Posicions' : 'Rols'}
            />
            <div className="selection-bar-tags">
                <div className={`position-select-tags ${isPosition ? "active" : ""}`} onClick={() => {
                    setSelectedTag("posicions");
                    loadCollesPositions();
                    setShowModalPosicions(false);
                    setShowModalRols(false);
                }}>Posicions</div>
                <div className='grups-select-tags'>Grups</div>
                {hasAccess("permisos") && (
                    <>
                        <div className={`rols-select-tags ${isRole ? "active" : ""}`} onClick={() => {
                            setSelectedTag("rols");
                            loadCollesRoles();
                            setShowModalPosicions(false);
                            setShowModalRols(false);
                        }}>Rols</div>
                    </>
                )}
            </div>

            {
                message && (
                    <div className={`message ${message.type}`}>
                        {message.message}
                    </div>
                )
            }
            <div className="button-section-tags">
                {((hasWritePermission("colla") && isPosition) || (!isPosition && hasWritePermission("permisos"))) && (
                    <>
                        <Button
                            text={isPosition ? 'Afegir posició' : 'Afegir rol'}
                            icon={<FaPlusSquare />}
                            action={() => {
                                if (isPosition) {
                                    setCreate(true);
                                    setNewPositionTag({ nom: "", descripcio: "" })
                                    setShowModalPosicions(true);
                                } else {
                                    setCreate(true);
                                    setNewRoleTag({ nom: "", descripcio: "" });
                                    resetPermisos();
                                    setShowModalRols(true);
                                }
                            }}
                        />
                    </>
                )}
            </div>
            <div className="search-bar-tags">
                <span>Cercar:</span>
                <FaSearch className="search-icon-tags" />
                <input type='search' placeholder='Cercar...'></input>
            </div>
            {isPosition && (
                <div className="table-posicions-tags">
                    <table>
                        <colgroup>
                            <col style={{ width: "20%" }} />
                            <col style={{ width: "50%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                        </colgroup>

                        <thead>
                            <tr>
                                <th>Posició</th>
                                <th>Descripció</th>
                                <th>Color</th>
                                <th>Modificar</th>
                                <th>Eliminar</th>
                            </tr>
                        </thead>
                        <tbody>
                            {positions.map((position) => (
                                <>
                                    <tr key={position.id}>
                                        <td>{position.nom}</td>
                                        <td>{position.descripcio}</td>
                                        <td>
                                            <div
                                                className="color-box-tags"
                                                style={{ backgroundColor: position.color }}
                                            />
                                        </td>
                                        <td>
                                            <button onClick={() => {
                                                if (hasWritePermission("colla")) {
                                                    setCurrentPosition(position.id);
                                                    setCreate(false);
                                                    setNewPositionTag({
                                                        nom: position.nom,
                                                        descripcio: position.descripcio, color: position.color
                                                    });
                                                    setShowModalPosicions(true);
                                                }
                                            }}>
                                                <FaPencilAlt />
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => {
                                                if (hasWritePermission("colla")) {
                                                    deletePosicioCall(position.id);
                                                }
                                            }}>
                                                <FaTrashAlt />
                                            </button>
                                        </td>
                                    </tr >
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
            {
                isRole && (
                    <div className="table-rols-tags">
                        <table>
                            <colgroup>
                                <col style={{ width: "20%" }} />
                                <col style={{ width: "60%" }} />
                                <col style={{ width: "10%" }} />
                                <col style={{ width: "10%" }} />
                            </colgroup>

                            <thead>
                                <tr>
                                    <th>Rol</th>
                                    <th>Descripció</th>
                                    <th>Modificar</th>
                                    <th>Eliminar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rols.map((rol) => (
                                    <>
                                        <tr key={rol.id}>
                                            <td>{rol.nom}</td>
                                            <td>{rol.descripcio}</td>
                                            <td>
                                                <button onClick={() => {
                                                    if (rol.nom != "Administrador" && rol.nom != 'Membre' && hasWritePermission("permisos")) {
                                                        setCurrentRole(rol.id);
                                                        setCreate(false);
                                                        setNewRoleTag({ nom: rol.nom, descripcio: rol.descripcio });
                                                        setPermisos(rol.permisos || defaultPermisos);
                                                        setShowModalRols(true);
                                                    }
                                                }}>
                                                    <FaPencilAlt />
                                                </button>
                                            </td>
                                            <td>
                                                <button onClick={() => {
                                                    if (rol.nom != "Administrador" && rol.nom != 'Membre' && hasWritePermission("permisos")) {
                                                        deletePosicioRoles(rol.id);
                                                    }
                                                }}>
                                                    <FaTrashAlt />
                                                </button>
                                            </td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )
            }
            {
                showModalPosicions && (
                    <div className="modal-overlay-position">
                        <div className="modal-position">
                            <h2>
                                {isCreate ? "Nova posició" : "Modificar posició"}
                            </h2>
                            <div className="input-group">
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="Nom"
                                    value={newPositionTag.nom}
                                    onChange={(e) =>
                                        setNewPositionTag({ ...newPositionTag, nom: e.target.value })
                                    }
                                    inputTitle="Nom"
                                    readOnly={!isCreate}
                                />

                                <div className="color-group-add-tag">
                                    <span>Color</span>

                                    <div className="color-elements-add-tag">
                                        <input
                                            name="color"
                                            type="color"
                                            value={newPositionTag.color}
                                            onChange={(e) =>
                                                setNewPositionTag({
                                                    ...newPositionTag,
                                                    color: e.target.value
                                                })
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            <div>Descripció</div>
                            <div className="input-group">
                                <textarea
                                    placeholder="Descripció"
                                    value={newPositionTag.descripcio}
                                    onChange={(e) =>
                                        setNewPositionTag({ ...newPositionTag, descripcio: e.target.value })
                                    }
                                />
                            </div>
                            <div className="modal-buttons-position">

                                <Button
                                    text={isCreate ? "Afegir posició" : "Guardar canvis"}
                                    icon={isCreate ? <FaPlusSquare /> : <FaSave />}
                                    action={isCreate ? () => createPosicioCall() : () => updatePosicioCall(currentPosition)} />

                                <Button
                                    text="Cancelar"
                                    icon={<FaTimesCircle />}
                                    action={() => { setShowModalPosicions(false); setError(""); }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
            {
                showModalRols && (
                    <div className="modal-overlay-role">
                        <div className="modal-role">
                            <h2>
                                {isCreate ? "Nou rol" : "Modificar rol"}
                            </h2>
                            <div className="input-group">
                                <Input
                                    name="name"
                                    type="text"
                                    placeholder="Nom"
                                    value={newRoleTag.nom}
                                    onChange={(e) =>
                                        setNewRoleTag({ ...newRoleTag, nom: e.target.value })
                                    }
                                    inputTitle="Nom"
                                    readOnly={!isCreate}
                                />
                            </div>
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            <div>Descripció</div>
                            <div className="input-group">
                                <textarea
                                    placeholder="Descripció"
                                    value={newRoleTag.descripcio}
                                    onChange={(e) =>
                                        setNewRoleTag({ ...newRoleTag, descripcio: e.target.value })
                                    }
                                />
                            </div>

                            <div className="permisos-wrapper">
                                {Object.keys(permisos).map(key => (
                                    <PermisoSelector
                                        key={key}
                                        label={key}
                                        value={permisos[key]}
                                        onChange={(v) => updatePermiso(key, v)}
                                    />
                                ))}
                            </div>

                            <div className="modal-buttons-role">
                                <Button
                                    text={isCreate ? "Afegir Rol" : "Guardar canvis"}
                                    icon={isCreate ? <FaPlusSquare /> : <FaSave />}
                                    action={isCreate ? createPosicioRoles : () => updatePosicioRoles(currentRole)} />

                                <Button
                                    text="Cancelar"
                                    icon={<FaTimesCircle />}
                                    action={() => { setShowModalRols(false); setError("") }}
                                />
                            </div>
                        </div>
                    </div>
                )
            }
        </div >
    )
}

export default Etiquetes;