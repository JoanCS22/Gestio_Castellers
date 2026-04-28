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
        descripcio: ""
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

    const getCollesPositions = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/colla/getCollaPositions?id=${idColla}`, {
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
            setPositions(data);
            console.log("{DEBUG} Get colla's positions OK")
        } else {
            console.log("{DEBUG} Get colla's positions KO")
            setError(data.message);
        }
    }

    const createPosicio = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        if (newPositionTag.nom == "") {
            setError(`El camp nom no pot estar buit`);
            return;
        }

        const response = await fetch(`http://localhost:5000/colla/createCollaPosition?id=${idColla}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: newPositionTag.nom,
                descripcio: newPositionTag.descripcio || ""
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Create posicio OK");
            setError("");
            setShowModalPosicions(false);
            setNewPositionTag({ nom: "", descripcio: "" });
            showTempMessage("Posició creada correctament.");
            getCollesPositions();
        } else {
            console.log("{DEBUG} Create posicio KO");
            setError(data.message);
        }
    }

    const updatePosicio = async (idPosicio) => {

        if (!currentPosition) return;

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/colla/updateCollaPositions?id=${idPosicio}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                descripcio: newPositionTag.descripcio || ""
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Update posicio OK");
            setError("");
            setShowModalPosicions(false);
            setNewPositionTag({ nom: "", descripcio: "" });
            showTempMessage("Posició modificada correctament.");
            getCollesPositions();
        } else {
            console.log("{DEBUG} Update posicio KO");
            setError(data.message);
        }
    }

    const deletePosicio = async (idPosicio) => {

        if (!window.confirm("Segur que vols eliminar aquesta posició?")) return;

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/colla/deleteCollaPositions?id=${idPosicio}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Delete posicio OK");
            setError("");
            showTempMessage("Posició eliminada correctament.");
            getCollesPositions();
        } else {
            console.log("{DEBUG} Delete posicio KO");
            setError(data.message);
        }
    }

    const getCollesRoles = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/colla/getCollaRoles?id=${idColla}`, {
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
            setRols(data);
            console.log("{DEBUG} Get colla's roles OK")
        } else {
            console.log("{DEBUG} Get colla's roles KO")
            setError(data.message);
        }
    }

    const createRoles = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        if (newRoleTag.nom == "") {
            setError(`El camp nom no pot estar buit`);
            return;
        }

        const response = await fetch(`http://localhost:5000/colla/createCollaRoles?id=${idColla}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: newRoleTag.nom,
                descripcio: newRoleTag.descripcio || "",
                permisos: permisos
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Create posicio OK");
            setError("");
            setShowModalRols(false);
            setNewRoleTag({ nom: "", descripcio: "" });
            showTempMessage("Rol creat correctament.");
            resetPermisos();
            getCollesRoles();
        } else {
            console.log("{DEBUG} Create role KO");
            setError(data.message);
        }
    }

    const updateRoles = async (idRol) => {

        if (!currentRole) return;

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/colla/updateCollaRoles?id=${idRol}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                descripcio: newRoleTag.descripcio || "",
                permisos: permisos
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Update roles OK");
            setError("");
            setShowModalRols(false);
            setNewRoleTag({ nom: "", descripcio: "" });
            resetPermisos();
            showTempMessage("Rol modificat correctament.");
            getCollesRoles();
        } else {
            console.log("{DEBUG} Update roles KO");
            setError(data.message);
        }
    }

    const deleteRoles = async (idRol) => {

        if (!window.confirm("Segur que vols eliminar aquest rol?")) return;

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/colla/deleteCollaRole?id=${idRol}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Delete roles OK");
            setError("");
            showTempMessage("Rol eliminat correctament.");
            getCollesRoles();
        } else {
            console.log("{DEBUG} Delete roles KO");
            setError(data.message);
        }
    }

    useEffect(() => {
        getCollesPositions();
    }, []);

    return (
        <div>
            <TopMenu
                title={isPosition ? 'Posicions' : 'Rols'}
            />
            <div className="selection-bar-tags">
                <div className={`position-select-tags ${isPosition ? "active" : ""}`} onClick={() => {
                    setSelectedTag("posicions");
                    getCollesPositions();
                    setShowModalPosicions(false);
                    setShowModalRols(false);
                }}>Posicions</div>
                <div className='grups-select-tags'>Grups</div>
                {hasAccess("permisos") && (
                    <>
                        <div className={`rols-select-tags ${isRole ? "active" : ""}`} onClick={() => {
                            setSelectedTag("rols");
                            getCollesRoles();
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
                            <col style={{ width: "60%" }} />
                            <col style={{ width: "10%" }} />
                            <col style={{ width: "10%" }} />
                        </colgroup>

                        <thead>
                            <tr>
                                <th>Posició</th>
                                <th>Descripció</th>
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
                                            <button onClick={() => {
                                                if (hasWritePermission("colla")) {
                                                    setCurrentPosition(position.id);
                                                    setCreate(false);
                                                    setNewPositionTag({ nom: position.nom, descripcio: position.descripcio });
                                                    setShowModalPosicions(true);
                                                }
                                            }}>
                                                <FaPencilAlt />
                                            </button>
                                        </td>
                                        <td>
                                            <button onClick={() => {
                                                if (hasWritePermission("colla")) {
                                                    deletePosicio(position.id);
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
                                                        deleteRoles(rol.id);
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
                                    action={isCreate ? createPosicio : () => updatePosicio(currentPosition)} />

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
                                    action={isCreate ? createRoles : () => updateRoles(currentRole)} />

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