import {
    modifyAssistenciaPreviaTecnica, confirmAssistenciaTecnica, getAssistenciaByEsdeveniment
} from "../services/assistenciaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaSearch, FaCheckDouble, FaCheck, FaPencilAlt,
    FaTimes, FaQuestion, FaRegQuestionCircle
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import './Assistencia_Llistat.css';
import TopMenu from "../components/TopMenu";

const LlistatAssistencia = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentColla } = useColla();

    const params = new URLSearchParams(location.search);
    const idEsdeveniment = params.get("idEsdeveniment");
    const nomEsdeveniment = params.get("nomEsdeveniment");

    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [isUpdating, setIsUpdating] = useState(false);
    const [lastUpdate, setLastUpdate] = useState(null);
    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");
    const [loadingIds, setLoadingIds] = useState([]);
    const [assistencia, setAssistencia] = useState([]);
    const [search, setSearch] = useState("");

    const stats = {
        final: assistencia.filter(a => a.confirmacio_arribada === "si").length,
        ok: assistencia.filter(a => a.confirmacio_previa === "si").length,
        ko: assistencia.filter(a => a.confirmacio_previa === "no").length,
        unknown: assistencia.filter(a => a.confirmacio_previa === "no_sap").length,
        pendent: assistencia.filter(a => a.confirmacio_previa === "pendent").length,
    };

    const cicle = { si: "no", no: "no_sap", no_sap: "si" };

    const estatPrevi = (memberId, currentValue) => {
        const newValue = cicle[currentValue] || "si";
        setAssistencia(prev =>
            prev.map(m => m.id === memberId ? { ...m, confirmacio_previa: newValue } : m)
        );
        return newValue;
    };

    const estatArribada = (memberId, currentValue) => {
        const newValue = cicle[currentValue] || "si";
        setAssistencia(prev =>
            prev.map(m => m.id === memberId ? { ...m, confirmacio_arribada: newValue } : m)
        );
        return newValue;
    };

    /* Retorna les classes CSS de l'indicador segons el valor */
    const indicatorClass = (value) => {
        switch (value) {
            case "si": return "assistencia-indicator assistencia-indicator--ok";
            case "no": return "assistencia-indicator assistencia-indicator--ko";
            case "no_sap": return "assistencia-indicator assistencia-indicator--unknown";
            default: return "assistencia-indicator assistencia-indicator--pendent";
        }
    };

    const renderIcon = (value) => {
        switch (value) {
            case "si": return <FaCheck />;
            case "no": return <FaTimes />;
            case "no_sap": return <FaQuestion />;
            default: return <FaRegQuestionCircle />;
        }
    };

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 1000);
    };

    const loadAssistencia = async () => {
        if (isUpdating) return;
        try {
            const data = await getAssistenciaByEsdeveniment(idEsdeveniment);
            setAssistencia(data);
            setLastUpdate(new Date());
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const modifyPrevia = async (assist) => {
        if (loadingIds.includes(assist.id)) return;
        const newValue = estatPrevi(assist.id, assist.confirmacio_previa);
        setLoadingIds(prev => [...prev, assist.id]);
        setIsUpdating(true);
        try {
            await modifyAssistenciaPreviaTecnica(assist.id, newValue);
            showTempMessage("Assistència prèvia modificada.");
            await loadAssistencia();
        } catch (err) { handleApiError(err, navigate, setError); }
        finally {
            setLoadingIds(prev => prev.filter(id => id !== assist.id));
            setIsUpdating(false);
        }
    };

    const modifyArribada = async (assist) => {
        if (loadingIds.includes(assist.id)) return;
        const newValue = estatArribada(assist.id, assist.confirmacio_arribada);
        setLoadingIds(prev => [...prev, assist.id]);
        setIsUpdating(true);
        try {
            await confirmAssistenciaTecnica(assist.id, newValue);
            showTempMessage("Assistència arribada modificada.");
            await loadAssistencia();
        } catch (err) { handleApiError(err, navigate, setError); }
        finally {
            setLoadingIds(prev => prev.filter(id => id !== assist.id));
            setIsUpdating(false);
        }
    };

    useEffect(() => {
        loadAssistencia();
        const interval = setInterval(() => {
            if (document.visibilityState === "visible") loadAssistencia();
        }, 8000);
        return () => clearInterval(interval);
    }, [idEsdeveniment]);

    const filtered = assistencia.filter(a =>
        !search || a.mote?.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div>
            <TopMenu title={`Assistència ${nomEsdeveniment}`} />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="assistencia-page">

                <div className="assistencia-top-row">
                    <div className="assistencia-top-left">
                        {lastUpdate && (
                            <p className="assistencia-last-update">
                                Última actualització: {lastUpdate.toLocaleTimeString("es-ES")}
                            </p>
                        )}
                        <button
                            className="btn-my-assistencia"
                            onClick={() => navigate(`/assistencia_usuari?idEsdeveniment=${idEsdeveniment}`)}
                        >
                            <FaPencilAlt /> La meva assistència
                        </button>
                    </div>

                    <div className="assistencia-stats">
                        <div className="stat-chip">
                            <div className="stat-chip-value stat-chip-value--final">
                                <FaCheckDouble /> {stats.final}
                            </div>
                            <span className="stat-chip-label">Verificats</span>
                        </div>
                        <div className="stat-chip">
                            <div className="stat-chip-value stat-chip-value--ok">
                                <FaCheck /> {stats.ok}
                            </div>
                            <span className="stat-chip-label">Confirmats</span>
                        </div>
                        <div className="stat-chip">
                            <div className="stat-chip-value stat-chip-value--ko">
                                <FaTimes /> {stats.ko}
                            </div>
                            <span className="stat-chip-label">Baixes</span>
                        </div>
                        <div className="stat-chip">
                            <div className="stat-chip-value stat-chip-value--unknown">
                                <FaQuestion /> {stats.unknown}
                            </div>
                            <span className="stat-chip-label">Dubtes</span>
                        </div>
                        <div className="stat-chip">
                            <div className="stat-chip-value stat-chip-value--pendent">
                                <FaRegQuestionCircle /> {stats.pendent}
                            </div>
                            <span className="stat-chip-label">Sense dades</span>
                        </div>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="assistencia-table-card">

                    <div className="assistencia-table-toolbar">
                        <div className="assistencia-search">
                            <FaSearch />
                            <input
                                type="search"
                                placeholder="Cercar casteller..."
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="assistencia-table-scroll">
                        <table className="assistencia-table">
                            <thead>
                                <tr>
                                    <th>Sobrenom</th>
                                    <th className="center"><FaCheck /></th>
                                    <th className="center"><FaCheckDouble /></th>
                                    <th className="center">Acompanyants</th>
                                    <th>Comentari</th>
                                    <th>Actualització</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(assist => (
                                    <tr key={assist.id}>
                                        <td><span className="cell-mote">{assist.mote}</span></td>

                                        <td
                                            className={`center ${loadingIds.includes(assist.id) ? "loading-assistencia" : ""}`}
                                            onClick={() => modifyPrevia(assist)}
                                        >
                                            <div className={indicatorClass(assist.confirmacio_previa)}>
                                                {renderIcon(assist.confirmacio_previa)}
                                            </div>
                                        </td>

                                        <td
                                            className={`center ${loadingIds.includes(assist.id) ? "loading-assistencia" : ""}`}
                                            onClick={() => modifyArribada(assist)}
                                        >
                                            <div className={indicatorClass(assist.confirmacio_arribada)}>
                                                {renderIcon(assist.confirmacio_arribada)}
                                            </div>
                                        </td>

                                        <td className="center">{assist.num_acompanyants}</td>

                                        <td>
                                            <span className={assist.comentari ? "cell-comentari--text" : "cell-comentari"}>
                                                {assist.comentari || "—"}
                                            </span>
                                        </td>

                                        <td>
                                            <span className="cell-data">
                                                {new Date(assist.data_actualitzacio).toLocaleString("es-ES")}
                                            </span>
                                        </td>
                                    </tr>
                                ))}

                                {filtered.length === 0 && (
                                    <tr>
                                        <td colSpan={6} style={{ textAlign: "center", padding: "var(--space-xl)", color: "var(--on-surface-variant)" }}>
                                            No s'han trobat registres
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="assistencia-table-footer">
                        <p>Mostrant {filtered.length} registres de l'esdeveniment</p>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default LlistatAssistencia;
