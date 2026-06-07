import { getCollesFutureEsdeveniments } from "../services/esdevenimentsService.js";
import { getAssistenciaByEsdeveniment, getAssistenciaActual, modifyAssistenciaPreviaTecnica } from "../services/assistenciaService.js";
import { getProvesByEsdeveniment } from "../services/provesService.js";
import { getNotifications } from "../services/notificacionsService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPermissions } from "../utils/utils.jsx";

import {
    FaPencilAlt, FaUsers, FaRegEye, FaCalendarAlt, FaCheck, FaTimes, FaCommentDots,
    FaQuestion, FaBandAid, FaClipboardList, FaHashtag, FaCheckCircle, FaTimesCircle,
    FaClock
} from "react-icons/fa";

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Dashboard.css";

import { useEvent } from "../context/EventContext.jsx";
import { useColla } from "../context/CollaContext.jsx";

function Dashboard() {
    const navigate = useNavigate();

    const { currentColla, loadingColles } = useColla();

    const permissions = getPermissions();
    const permissionsReady = permissions && Object.keys(permissions).length > 0;
    const hasAccess = (key) => permissions[key] !== "X";
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasReadPermission = (key) => permissions[key] === "R";

    const [error, setError] = useState("");
    const [futurs, setFuturs] = useState([]);
    const [futurProves, setFuturProves] = useState([]);
    const [assistenciaByEvent, setAssistenciaByEvent] = useState({});
    const [notificacions, setNotificacions] = useState([]);

    const [currentAssistance, setCurrentAssistance] = useState({
        id: 0, seleccionat: null,
    });

    const { setCurrentEvent } = useEvent();

    const getStats = (id) => {
        const assistencia = assistenciaByEvent[id] || [];
        return {
            ok: assistencia.filter(a => a.confirmacio_previa === "si").length,
            ko: assistencia.filter(a => a.confirmacio_previa === "no").length,
            unknown: assistencia.filter(a => a.confirmacio_previa === "no_sap").length,
        };
    };

    const loadFutureEsdeveniments = async () => {
        try {
            const data = await getCollesFutureEsdeveniments(currentColla.id);
            let result = data;
            if (hasWritePermission("esdeveniments")) {
                result = data.slice(0, 3);
            } else if (hasReadPermission("esdeveniments")) {
                result = data.filter(e => e.visible === true).slice(0, 3);
            } else {
                result = [];
            }
            setFuturs(result);
            setCurrentEvent(result.length > 0 ? result[0] : null);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    const loadAssistencia = async (idEsdeveniment) => {
        try {
            const data = await getAssistenciaByEsdeveniment(idEsdeveniment);
            setAssistenciaByEvent(prev => ({ ...prev, [idEsdeveniment]: data }));
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    const loadProves = async (idEsdeveniment) => {
        try {
            const data = await getProvesByEsdeveniment(idEsdeveniment);
            setFuturProves(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    const loadNotifications = async () => {
        try {
            const data = await getNotifications(currentColla.id);
            setNotificacions(data.slice(0, 2));
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    const loadAssistenciaActual = async (idEsdeveniment) => {
        try {
            const data = await getAssistenciaActual(idEsdeveniment);
            setCurrentAssistance({
                id: data.id,
                seleccionat: data.confirmacio_previa,
            });
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const modifyPrevia = async (newValue) => {
        try {
            await modifyAssistenciaPreviaTecnica(currentAssistance.id, newValue);
            setCurrentAssistance({ id: currentAssistance.id, seleccionat: newValue });
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    useEffect(() => {
        if (loadingColles || !currentColla) return;
        setFuturs([]);
        setFuturProves([]);
        setAssistenciaByEvent({});
        setNotificacions([]);
        loadFutureEsdeveniments();
        loadNotifications();
    }, [currentColla]);

    useEffect(() => {
        if (futurs.length > 0) {
            futurs.forEach(e => loadAssistencia(e.id));
            loadProves(futurs[0].id);
            loadAssistenciaActual(futurs[0].id);
        }
    }, [futurs]);

    const primerEsdeveniment = futurs.length > 0 ? futurs[0] : null;
    const statsProper = primerEsdeveniment ? getStats(primerEsdeveniment.id) : { ok: 0, ko: 0, unknown: 0 };

    return (
        <div>
            <TopMenu title="Dashboard" canvi_colla />

            <div className="dashboard-grid">

                <div className="left-column-dashboard">

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-label">Assistència Proper Assaig</span>
                            {primerEsdeveniment && (
                                <span
                                    className="dashboard-card-link"
                                    onClick={() => navigate(`/assistencia?idEsdeveniment=${primerEsdeveniment.id}&nomEsdeveniment=${encodeURIComponent(primerEsdeveniment.nom)}`)}
                                >
                                    Veure llista
                                </span>
                            )}
                        </div>

                        {primerEsdeveniment ? (
                            <>
                                <div className="assistencia-stats-grid">
                                    <div
                                        className={`assistencia-stat assistencia-stat--ok
                                            ${!hasWritePermission("assistencia") && currentAssistance.seleccionat === "si"
                                                ? "assistencia-stat--selected" : ""}`}
                                        onClick={() => modifyPrevia('si')}
                                    >
                                        <span className="assistencia-stat-number">
                                            {hasWritePermission("assistencia") ? (statsProper.ok) : <FaCheckCircle />}
                                        </span>
                                        <span className="assistencia-stat-label">
                                            {hasWritePermission("assistencia") ? (<> <FaCheckCircle /> Confirmats </>) : currentAssistance.seleccionat === "si" ? "Confirmat" : "Confirmar-se"}
                                        </span>
                                    </div>
                                    <div
                                        className={`assistencia-stat assistencia-stat--ko
                                            ${!hasWritePermission("assistencia") && currentAssistance.seleccionat === "no"
                                                ? "assistencia-stat--selected" : ""}`}
                                        onClick={() => modifyPrevia('no')}
                                    >
                                        <span className="assistencia-stat-number">
                                            {hasWritePermission("assistencia") ? (statsProper.ko) : <FaTimesCircle />}
                                        </span>
                                        <span className="assistencia-stat-label">
                                            {hasWritePermission("assistencia") ? (<> <FaTimesCircle /> Confirmats </>) : currentAssistance.seleccionat === "no" ? "Descartat" : "Descartar-se"}
                                        </span>
                                    </div>
                                    <div
                                        className={`assistencia-stat assistencia-stat--unknown
                                            ${!hasWritePermission("assistencia") && currentAssistance.seleccionat === "no_sap"
                                                ? "assistencia-stat--selected" : ""}`}
                                        onClick={() => modifyPrevia('no_sap')}
                                    >
                                        <span className="assistencia-stat-number">
                                            {hasWritePermission("assistencia") ? (statsProper.unknown) : <FaQuestion />}
                                        </span>
                                        <span className="assistencia-stat-label">
                                            {hasWritePermission("assistencia") ? (<> <FaQuestion /> Pendents </>) : "Tinc dubtes" }
                                        </span>
                                    </div>
                                </div>

                                {primerEsdeveniment && (
                                    <>
                                        <div className="dashboard-card-footer">
                                            <span className="dashboard-card-footer-text">
                                                Si vols modificar més informació de l'assistència:
                                            </span>
                                            <button
                                                className="dashboard-card-footer-pill"
                                                onClick={() => navigate(`/assistencia_usuari?idEsdeveniment=${primerEsdeveniment.id}`)}
                                            >
                                                <FaPencilAlt /> Editar assistència
                                            </button>
                                        </div>
                                    </>
                                )}
                            </>
                        ) : (
                            <p className="dashboard-empty-text">No hi ha esdeveniments programats</p>
                        )}
                    </div>

                    <div className="dashboard-card dashboard-card--proves">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-label">Proves previstes</span>
                            {primerEsdeveniment && hasWritePermission("proves") && (
                                <span
                                    className="dashboard-card-link"
                                    onClick={() => navigate(`/proves?idEsdeveniment=${primerEsdeveniment.id}&nomEsdeveniment=${encodeURIComponent(primerEsdeveniment.nom)}`)}
                                >
                                    <FaPencilAlt /> Gestionar proves
                                </span>
                            )}
                        </div>

                        {primerEsdeveniment ? (
                            <div className="proves-grid-wrap">
                                <div className="proves-grid">
                                    {futurProves.length > 0 ? (
                                        <>
                                            {futurProves.map((prova) =>
                                                (hasAccess("proves") || prova.public) && (
                                                    <div
                                                        key={prova.id}
                                                        className="prova-card"
                                                        onClick={() => {
                                                            if (hasWritePermission("proves")) {
                                                                navigate(`/proves_board_edit?id=${prova.id}&idEsdeveniment=${primerEsdeveniment.id}&nomEsdeveniment=${encodeURIComponent(primerEsdeveniment.nom)}`);
                                                            } else {
                                                                navigate(`/proves_board_show?id=${prova.id}&idEsdeveniment=${primerEsdeveniment.id}&nomEsdeveniment=${encodeURIComponent(primerEsdeveniment.nom)}`);
                                                            }
                                                        }}
                                                    >
                                                        <span className="prova-card-nom">{prova.nom}</span>
                                                        <div className="prova-card-icons">
                                                            {prova.xarxa && <FaHashtag title="Amb xarxa" />}
                                                            {prova.feta == "feta"
                                                                ? <FaCheckCircle className="icon-feta-dashboard" title="Realitzada" />
                                                                : prova.feta == "cancelada" ? <FaTimesCircle className="icon-no-feta-dashboard" title="Cancelada" />
                                                                    : <FaClock className="icon-pendent-dashboard" title="Pendent de fer" />
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            )}
                                            {hasWritePermission("proves") && (
                                                <div
                                                    className="prova-card prova-card--add"
                                                    onClick={() => navigate(`/proves?idEsdeveniment=${primerEsdeveniment.id}&nomEsdeveniment=${encodeURIComponent(primerEsdeveniment.nom)}`)}
                                                >
                                                    <FaCheckCircle className="prova-card-add-icon" />
                                                    <span>Afegir prova</span>
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <p className="dashboard-empty-text">No hi ha proves per l'esdeveniment</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <p className="dashboard-empty-text">Crea un esdeveniment per afegir proves</p>
                        )}
                    </div>
                </div>

                <div className="right-column-dashboard">

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-label">Propers esdeveniments</span>
                            <FaCalendarAlt
                                className="dashboard-card-header-icon"
                                onClick={() => navigate("/esdeveniments")}
                            />
                        </div>

                        <div className="event-list">
                            {futurs.length > 0 ? (
                                futurs.map((esdeveniment) => {
                                    if (!(esdeveniment.visible || hasWritePermission("esdeveniments"))) return null;
                                    const stats = getStats(esdeveniment.id);
                                    const isNext = esdeveniment.id === primerEsdeveniment?.id;

                                    return (
                                        <div
                                            key={esdeveniment.id}
                                            className={`event-item ${isNext ? "event-item--active" : ""}`}
                                            onClick={() => navigate(`/consult_esdeveniment?idEsdeveniment=${esdeveniment.id}`)}
                                        >
                                            <div className="event-item-top">
                                                <span className={`event-item-tipus ${isNext ? "event-item-tipus--active" : ""}`}>
                                                    {esdeveniment.nom}
                                                </span>
                                                <span className="event-item-data">
                                                    {new Date(esdeveniment.data_esdeveniment).toLocaleDateString("ca-ES")}
                                                </span>
                                            </div>
                                            <p className="event-item-lloc">{esdeveniment.lloc || ""}</p>
                                            <div className="event-item-stats">
                                                <span className="event-badge event-badge--ok">
                                                    <FaCheckCircle /> {stats.ok}
                                                </span>
                                                <span className="event-badge event-badge--ko">
                                                    <FaTimesCircle /> {stats.ko}
                                                </span>
                                                <span className="event-badge event-badge--unknown">
                                                    <FaQuestion /> {stats.unknown}
                                                </span>
                                                {esdeveniment.hora && (
                                                    <span className="event-item-hora">{esdeveniment.hora}</span>
                                                )}
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="dashboard-empty-text">No existeixen futurs esdeveniments</p>
                            )}
                        </div>

                        <button
                            className="dashboard-card-footer-btn"
                            onClick={() => navigate("/esdeveniments")}
                        >
                            Veure calendari complet
                        </button>
                    </div>

                    <div className="dashboard-card">
                        <div className="dashboard-card-header">
                            <span className="dashboard-card-label">Darreres notificacions</span>
                            <FaCommentDots
                                className="dashboard-card-header-icon"
                                onClick={() => navigate("/notificacions_board")}
                            />
                        </div>

                        <div className="event-list">
                            {notificacions.length > 0 ? (
                                notificacions.map((notificacio) => (
                                    <div key={notificacio.id} className="event-item">
                                        <div className="event-item-top">
                                            <span className="event-item-tipus">
                                                {notificacio.nom_emisor}
                                            </span>
                                            <span className="event-item-data">
                                                {new Date(notificacio.data_programacio).toLocaleDateString("ca-ES")}
                                            </span>
                                        </div>
                                        <p className="event-item-lloc">{notificacio.titol}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="dashboard-empty-text">No tens notificacions</p>
                            )}
                        </div>

                        <button
                            className="dashboard-card-footer-btn"
                            onClick={() => navigate("/notificacions_board")}
                        >
                            Veure totes les notificacions
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default Dashboard;
