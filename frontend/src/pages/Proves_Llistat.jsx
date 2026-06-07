import {
    getProvesByEsdeveniment, saveOrder
} from "../services/provesService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaClipboardList, FaTimesCircle, FaCheckCircle, FaHashtag,
    FaPencilAlt, FaChevronUp, FaChevronDown, FaSave, FaClock
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import TopMenu from "../components/TopMenu.jsx";

import "./Proves_Llistat.css";

function ProvesLlistat() {
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
    const [editMode, setEditMode] = useState(false);
    const [originalProves, setOriginalProves] = useState([]);

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const moveProva = (id, direction) => {
        const updated = [...proves];
        const index = updated.findIndex(p => p.id === id);
        if (direction === "up" && index > 0) [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
        if (direction === "down" && index < updated.length - 1) [updated[index + 1], updated[index]] = [updated[index], updated[index + 1]];
        setProves(updated.map((p, i) => ({ ...p, ordre: i + 1 })));
    };

    const loadProves = async () => {
        try { setProves(await getProvesByEsdeveniment(idEsdeveniment)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const saveOrderCall = async () => {
        try {
            await saveOrder(proves.map(p => ({ id: p.id, ordre: p.ordre })));
            showTempMessage("Ordre guardat correctament.");
            setEditMode(false);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    useEffect(() => { loadProves(); }, []);

    const visible = proves.filter(p => p.public || hasWritePermission("proves"));
    const totalFetes = visible.filter(p => p.feta == "feta").length;
    const totalXarxa = visible.filter(p => p.xarxa).length;

    return (
        <div>
            <TopMenu title={`Proves ${nomEsdeveniment}`} tornar />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="llistat-page">

                <div className="llistat-stats">
                    <div className="llistat-stat-card">
                        <div className="llistat-stat-icon llistat-stat-icon--total">
                            <FaClipboardList />
                        </div>
                        <div>
                            <div className="llistat-stat-label">Total proves</div>
                            <div className="llistat-stat-value">
                                {String(visible.length).padStart(2, "0")}
                            </div>
                        </div>
                    </div>
                    <div className="llistat-stat-card">
                        <div className="llistat-stat-icon llistat-stat-icon--fetes">
                            <FaCheckCircle />
                        </div>
                        <div>
                            <div className="llistat-stat-label">Realitzades</div>
                            <div className="llistat-stat-value">
                                {String(totalFetes).padStart(2, "0")}
                                <span className="llistat-stat-sub">/ {visible.length}</span>
                            </div>
                        </div>
                    </div>
                    <div className="llistat-stat-card">
                        <div className="llistat-stat-icon llistat-stat-icon--xarxa">
                            <FaHashtag />
                        </div>
                        <div>
                            <div className="llistat-stat-label">Amb xarxa</div>
                            <div className="llistat-stat-value">
                                {String(totalXarxa).padStart(2, "0")}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="llistat-table-wrap">

                    <div className="llistat-table-header">
                        <span className="llistat-table-title">Estructura de l'assaig</span>
                        <div className="llistat-table-actions">
                            {hasWritePermission("proves") && !editMode && (
                                <button
                                    className="btn-llistat-secondary"
                                    onClick={() => { setOriginalProves([...proves]); setEditMode(true); }}
                                >
                                    <FaPencilAlt /> Canviar ordre
                                </button>
                            )}
                            {editMode && (
                                <>
                                    <button className="btn-llistat-danger"
                                        onClick={() => { setProves(originalProves); setEditMode(false); }}>
                                        <FaTimesCircle /> Cancel·lar
                                    </button>
                                    <button className="btn-llistat-primary" onClick={saveOrderCall}>
                                        <FaSave /> Guardar ordre
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table className="llistat-table">
                            <thead>
                                <tr>
                                    <th style={{ width: "8%" }}>Ordre</th>
                                    <th style={{ width: "20%" }}>Nom</th>
                                    <th style={{ width: "12%" }}>Estructura</th>
                                    <th>Comentari</th>
                                    <th className="center" style={{ width: "10%" }}>Realitzada?</th>
                                    <th className="center" style={{ width: "10%" }}>Xarxa?</th>
                                </tr>
                            </thead>
                            <tbody>
                                {visible.map((prova, index) => (
                                    <tr
                                        key={prova.id}
                                        className={prova.feta == "feta" ? "row--feta" : ""}
                                    >
                                        <td>
                                            {editMode ? (
                                                <div className="ordre-controls">
                                                    <button
                                                        onClick={() => moveProva(prova.id, "up")}
                                                        disabled={index === 0}
                                                        title="Pujar"
                                                    >
                                                        <FaChevronUp />
                                                    </button>
                                                    <button
                                                        onClick={() => moveProva(prova.id, "down")}
                                                        disabled={index === visible.length - 1}
                                                        title="Baixar"
                                                    >
                                                        <FaChevronDown />
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="cell-ordre">
                                                    {String(prova.ordre ?? index + 1).padStart(2, "0")}
                                                </span>
                                            )}
                                        </td>

                                        <td>
                                            <span className="cell-nom-title">{prova.nom}</span>
                                        </td>

                                        <td>
                                            <span className="cell-estructura-badge">{prova.estructura}</span>
                                        </td>

                                        <td>
                                            <span className="cell-comentari">
                                                {prova.comentari || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <div className="cell-indicator">
                                                {prova.feta == "feta"
                                                    ? <span className="indicator-ok"><FaCheckCircle /></span>
                                                    : prova.feta == "cancelada" ? <span className="indicator-ko"><FaTimesCircle /></span>
                                                    : <span className="indicator-pendent"><FaClock /></span>
                                                }
                                            </div>
                                        </td>

                                        <td>
                                            <div className="cell-indicator">
                                                {prova.xarxa
                                                    ? <span className="indicator-xarxa">#</span>
                                                    : <span className="indicator-none">—</span>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}

                                {visible.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--on-surface-variant)" }}>
                                            No hi ha proves per aquest assaig
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

            </div>
        </div>
    );
}

export default ProvesLlistat;