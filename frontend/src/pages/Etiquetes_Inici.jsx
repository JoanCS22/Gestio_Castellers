import {
    getCollesPositions, createPosicio, updatePosicio, deletePosicio,
    getCollesRoles, createRoles, updateRoles, deleteRoles,
    getCollesGroups, createGroup, updateGroup, deleteGroup,
} from "../services/collaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
    FaPlusSquare, FaSearch, FaSave, FaTimesCircle, FaTrashAlt, FaPencilAlt
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import './Etiquetes_Inici.css';
import TopMenu from "../components/TopMenu";
import PermisoSelector from "../components/PermisoSelector";

function Etiquetes() {
    const navigate = useNavigate();
    const { currentColla } = useColla();

    const permissions        = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasAccess          = (key) => permissions[key] !== "X";

    const [message, setTempMessage] = useState(null);
    const [error, setError]         = useState("");
    const [selectedTag, setSelectedTag] = useState("posicions");

    const [positions, setPositions] = useState([]);
    const [rols,      setRols]      = useState([]);
    const [grups,     setGrups]     = useState([]);

    const [showModalPosicions, setShowModalPosicions] = useState(false);
    const [showModalRols,      setShowModalRols]      = useState(false);
    const [showModalGroups,    setShowModalGroups]    = useState(false);

    const [newPositionTag, setNewPositionTag] = useState({ nom: "", descripcio: "", color: "#d3d3d3" });
    const [newRoleTag,     setNewRoleTag]     = useState({ nom: "", descripcio: "" });
    const [newGroupTag,    setNewGroupTag]    = useState({ nom: "", descripcio: "" });

    const defaultPermisos = {
        esdeveniments: "X", proves: "X", plantilles: "X", assistencia: "X",
        notificacions: "X", colla: "X", permisos: "X", membres: "X", llistats: "X"
    };

    const [permisos, setPermisos] = useState(defaultPermisos);
    const [isCreate,  setCreate]  = useState(true);
    const [currentPosition, setCurrentPosition] = useState(null);
    const [currentRole,     setCurrentRole]     = useState(null);
    const [currentGroup,    setCurrentGroup]    = useState(null);
    const [search, setSearch] = useState("");

    const isPosition = selectedTag === "posicions";
    const isRole     = selectedTag === "rols";
    const isGroup    = selectedTag === "grups";

    const updatePermiso  = (key, value) => setPermisos(prev => ({ ...prev, [key]: value }));
    const resetPermisos  = () => setPermisos(defaultPermisos);

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    /* ── Càrregues ── */
    const loadCollesPositions = async () => {
        try { setPositions(await getCollesPositions(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };
    const loadCollesRoles = async () => {
        try { setRols(await getCollesRoles(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };
    const loadCollesGrups = async () => {
        try { setGrups(await getCollesGroups(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    /* ── Posicions ── */
    const createPosicioCall = async () => {
        if (!newPositionTag.nom) { setError("El camp nom no pot estar buit"); return; }
        try {
            await createPosicio(currentColla.id, newPositionTag);
            setShowModalPosicions(false);
            setNewPositionTag({ nom: "", descripcio: "", color: "#d3d3d3" });
            setError(""); showTempMessage("Posició creada.");
            loadCollesPositions();
        } catch (err) { handleApiError(err, navigate, setError); }
    };
    const updatePosicioCall = async () => {
        if (!currentPosition) return;
        try {
            await updatePosicio(currentPosition, newPositionTag);
            setShowModalPosicions(false);
            setNewPositionTag({ nom: "", descripcio: "", color: "#d3d3d3" });
            setError(""); showTempMessage("Posició modificada.");
            loadCollesPositions();
        } catch (err) { handleApiError(err, navigate, setError); }
    };
    const deletePosicioCall = async (id) => {
        if (!window.confirm("Segur que vols eliminar aquesta posició?")) return;
        try { await deletePosicio(id); showTempMessage("Posició eliminada."); loadCollesPositions(); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    /* ── Rols ── */
    const createCollaRoles = async () => {
        if (!newRoleTag.nom) { setError("El camp nom no pot estar buit"); return; }
        try {
            await createRoles(currentColla.id, newRoleTag, permisos);
            setShowModalRols(false); setNewRoleTag({ nom: "", descripcio: "" }); resetPermisos();
            setError(""); showTempMessage("Rol creat."); loadCollesRoles();
        } catch (err) { handleApiError(err, navigate, setError); }
    };
    const updateCollaRoles = async (id) => {
        if (!currentRole) return;
        try {
            await updateRoles(id, newRoleTag, permisos);
            setShowModalRols(false); setNewRoleTag({ nom: "", descripcio: "" }); resetPermisos();
            setError(""); showTempMessage("Rol modificat."); loadCollesRoles();
        } catch (err) { handleApiError(err, navigate, setError); }
    };
    const deleteCollaRoles = async (id) => {
        if (!window.confirm("Segur que vols eliminar aquest rol?")) return;
        try { await deleteRoles(id); showTempMessage("Rol eliminat."); loadCollesRoles(); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    /* ── Grups ── */
    const createCollaGrups = async () => {
        if (!newGroupTag.nom) { setError("El camp nom no pot estar buit"); return; }
        try {
            await createGroup(currentColla.id, newGroupTag);
            setShowModalGroups(false); setNewGroupTag({ nom: "", descripcio: "" });
            setError(""); showTempMessage("Grup creat."); loadCollesGrups();
        } catch (err) { handleApiError(err, navigate, setError); }
    };
    const updateCollaGrups = async (id) => {
        if (!currentGroup) return;
        try {
            await updateGroup(id, newGroupTag);
            setShowModalGroups(false); setNewGroupTag({ nom: "", descripcio: "" });
            setError(""); showTempMessage("Grup modificat."); loadCollesGrups();
        } catch (err) { handleApiError(err, navigate, setError); }
    };
    const deleteCollaGrups = async (id) => {
        if (!window.confirm("Segur que vols eliminar aquest grup?")) return;
        try { await deleteGroup(id); showTempMessage("Grup eliminat."); loadCollesGrups(); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    useEffect(() => { loadCollesPositions(); loadCollesRoles(); loadCollesGrups(); }, []);

    const canAdd = (isPosition && hasWritePermission("colla"))
        || (isGroup && hasWritePermission("colla"))
        || (isRole && hasWritePermission("permisos"));

    /* Filtratge local */
    const currentData = isPosition ? positions : isGroup ? grups : rols;
    const filtered = currentData.filter(item =>
        !search || item.nom?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <TopMenu title={isPosition ? "Posicions" : isRole ? "Rols" : "Grups"} />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="etiquetes-page">

                <div className="selection-bar-tags">
                    <div
                        className={`position-select-tags ${isPosition ? "active" : ""}`}
                        onClick={() => { setSelectedTag("posicions"); setShowModalGroups(false); setShowModalRols(false); }}
                    >
                        Posicions
                    </div>
                    <div
                        className={`grups-select-tags ${isGroup ? "active" : ""}`}
                        onClick={() => { setSelectedTag("grups"); setShowModalPosicions(false); setShowModalRols(false); }}
                    >
                        Grups
                    </div>
                    {hasAccess("permisos") && (
                        <div
                            className={`rols-select-tags ${isRole ? "active" : ""}`}
                            onClick={() => { setSelectedTag("rols"); setShowModalPosicions(false); setShowModalGroups(false); }}
                        >
                            Rols
                        </div>
                    )}
                </div>

                <div className="etiquetes-toolbar">
                    <div className="etiquetes-search">
                        <FaSearch />
                        <input
                            type="search"
                            placeholder={`Cercar ${isPosition ? "posició" : isGroup ? "grup" : "rol"}...`}
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                        />
                    </div>
                    {canAdd && (
                        <button className="btn-add-etiqueta" onClick={() => {
                            setCreate(true);
                            if (isPosition) { setNewPositionTag({ nom: "", descripcio: "", color: "#d3d3d3" }); setShowModalPosicions(true); }
                            else if (isRole) { setNewRoleTag({ nom: "", descripcio: "" }); resetPermisos(); setShowModalRols(true); }
                            else { setNewGroupTag({ nom: "", descripcio: "" }); setShowModalGroups(true); }
                        }}>
                            <FaPlusSquare />
                            {isPosition ? "Afegir posició" : isGroup ? "Afegir grup" : "Afegir rol"}
                        </button>
                    )}
                </div>

                {error && !showModalPosicions && !showModalRols && !showModalGroups && (
                    <div className="error-message">{error}</div>
                )}

                <div className="etiquetes-table-card">
                    <table className="etiquetes-table">
                        <thead>
                            <tr>
                                <th>{isPosition ? "Posició" : isGroup ? "Grup" : "Rol"}</th>
                                <th>Descripció</th>
                                {isPosition && <th>Color</th>}
                                <th>Accions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map(item => (
                                <tr key={item.id}>
                                    <td><span className="etiqueta-nom">{item.nom}</span></td>
                                    <td><span className="etiqueta-descripcio">{item.descripcio || "—"}</span></td>
                                    {isPosition && (
                                        <td>
                                            <div className="color-cell">
                                                <div
                                                    className="color-swatch"
                                                    style={{ backgroundColor: item.color || "#d3d3d3" }}
                                                />
                                                <span className="color-hex">{item.color || "—"}</span>
                                            </div>
                                        </td>
                                    )}
                                    <td>
                                        <div className="etiqueta-actions">
                                            <button
                                                className="btn-etiqueta-action btn-etiqueta-action--edit"
                                                title="Modificar"
                                                onClick={() => {
                                                    const blocked = isRole && (item.nom === "Administrador" || item.nom === "Membre");
                                                    if (blocked) return;
                                                    setCreate(false);
                                                    if (isPosition) {
                                                        setCurrentPosition(item.id);
                                                        setNewPositionTag({ nom: item.nom, descripcio: item.descripcio, color: item.color });
                                                        setShowModalPosicions(true);
                                                    } else if (isRole) {
                                                        setCurrentRole(item.id);
                                                        setNewRoleTag({ nom: item.nom, descripcio: item.descripcio });
                                                        setPermisos(item.permisos || defaultPermisos);
                                                        setShowModalRols(true);
                                                    } else {
                                                        setCurrentGroup(item.id);
                                                        setNewGroupTag({ nom: item.nom, descripcio: item.descripcio });
                                                        setShowModalGroups(true);
                                                    }
                                                }}
                                            >
                                                <FaPencilAlt />
                                            </button>
                                            <button
                                                className="btn-etiqueta-action btn-etiqueta-action--delete"
                                                title="Eliminar"
                                                onClick={() => {
                                                    const blocked = isRole && (item.nom === "Administrador" || item.nom === "Membre");
                                                    if (blocked) return;
                                                    if (isPosition) deletePosicioCall(item.id);
                                                    else if (isRole) deleteCollaRoles(item.id);
                                                    else deleteCollaGrups(item.id);
                                                }}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={isPosition ? 4 : 3} style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--on-surface-variant)" }}>
                                        No s'han trobat registres
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="etiquetes-table-footer">
                        <p>Mostrant {filtered.length} de {currentData.length} registres</p>
                    </div>
                </div>
            </div>

            {(showModalPosicions || showModalGroups) && (
                <div className="modal-overlay-position">
                    <div className="modal-position">
                        <h2>{isCreate ? (isPosition ? "Nova posició" : "Nou grup") : (isPosition ? "Modificar posició" : "Modificar grup")}</h2>

                        <div className="modal-field">
                            <label>Nom</label>
                            <input
                                type="text"
                                placeholder="Nom"
                                value={isPosition ? newPositionTag.nom : newGroupTag.nom}
                                readOnly={!isCreate}
                                onChange={e => isPosition
                                    ? setNewPositionTag({ ...newPositionTag, nom: e.target.value })
                                    : setNewGroupTag({ ...newGroupTag, nom: e.target.value })
                                }
                            />
                        </div>

                        {isPosition && (
                            <div className="color-group-add-tag">
                                <span>Color</span>
                                <div className="color-elements-add-tag">
                                    <input
                                        type="color"
                                        value={newPositionTag.color}
                                        onChange={e => setNewPositionTag({ ...newPositionTag, color: e.target.value })}
                                    />
                                    <span style={{ fontSize: "var(--text-label-sm)", color: "var(--on-surface-variant)" }}>
                                        {newPositionTag.color}
                                    </span>
                                </div>
                            </div>
                        )}

                        <div className="modal-field">
                            <label>Descripció</label>
                            <textarea
                                placeholder="Descripció..."
                                value={isPosition ? newPositionTag.descripcio : newGroupTag.descripcio}
                                onChange={e => isPosition
                                    ? setNewPositionTag({ ...newPositionTag, descripcio: e.target.value })
                                    : setNewGroupTag({ ...newGroupTag, descripcio: e.target.value })
                                }
                            />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        <div className="modal-buttons-position">
                            <button style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 16px", background:"var(--surface-container-high)", color:"var(--on-surface)", border:"none", borderRadius:"var(--radius-md)", fontFamily:"var(--font-base)", fontSize:"var(--text-label-md)", fontWeight:700, cursor:"pointer" }}
                                onClick={() => { (isPosition ? setShowModalPosicions : setShowModalGroups)(false); setError(""); }}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                            <button style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 16px", background:"var(--primary)", color:"var(--on-primary)", border:"none", borderRadius:"var(--radius-md)", fontFamily:"var(--font-base)", fontSize:"var(--text-label-md)", fontWeight:700, cursor:"pointer", boxShadow:"var(--shadow-sm)" }}
                                onClick={isCreate ? (isPosition ? createPosicioCall : createCollaGrups) : (isPosition ? updatePosicioCall : () => updateCollaGrups(currentGroup))}>
                                {isCreate ? <><FaPlusSquare /> Afegir</> : <><FaSave /> Guardar</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModalRols && (
                <div className="modal-overlay-role">
                    <div className="modal-role">
                        <h2>{isCreate ? "Nou rol" : "Modificar rol"}</h2>

                        <div className="modal-field">
                            <label>Nom</label>
                            <input type="text" placeholder="Nom"
                                value={newRoleTag.nom} readOnly={!isCreate}
                                onChange={e => setNewRoleTag({ ...newRoleTag, nom: e.target.value })} />
                        </div>

                        <div className="modal-field">
                            <label>Descripció</label>
                            <textarea placeholder="Descripció..."
                                value={newRoleTag.descripcio}
                                onChange={e => setNewRoleTag({ ...newRoleTag, descripcio: e.target.value })} />
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

                        {error && <div className="error-message">{error}</div>}

                        <div className="modal-buttons-role">
                            <button style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 16px", background:"var(--surface-container-high)", color:"var(--on-surface)", border:"none", borderRadius:"var(--radius-md)", fontFamily:"var(--font-base)", fontSize:"var(--text-label-md)", fontWeight:700, cursor:"pointer" }}
                                onClick={() => { setShowModalRols(false); setError(""); }}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                            <button style={{ display:"inline-flex", alignItems:"center", gap:"8px", padding:"8px 16px", background:"var(--primary)", color:"var(--on-primary)", border:"none", borderRadius:"var(--radius-md)", fontFamily:"var(--font-base)", fontSize:"var(--text-label-md)", fontWeight:700, cursor:"pointer", boxShadow:"var(--shadow-sm)" }}
                                onClick={isCreate ? createCollaRoles : () => updateCollaRoles(currentRole)}>
                                {isCreate ? <><FaPlusSquare /> Afegir rol</> : <><FaSave /> Guardar</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Etiquetes;