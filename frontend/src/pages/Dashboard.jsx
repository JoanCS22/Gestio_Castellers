import { getCollesFutureEsdeveniments } from "../services/esdevenimentsService.js";
import { getAssistenciaByEsdeveniment } from "../services/assistenciaService.js";
import { getProvesByEsdeveniment } from "../services/provesService.js";
import { getNotifications } from "../services/notificacionsService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPermissions } from "../utils/utils.jsx"

import {
    FaPencilAlt, FaUsers, FaRegEye, FaCalendarAlt, FaCheck, FaTimes, FaCommentDots,
    FaQuestion, FaBandAid, FaClipboardList, FaHashtag, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Dashboard.css";

import { useEvent } from "../utils/EventContext.jsx"

function Dashboard() {
    const navigate = useNavigate();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const permissionsReady = permissions && Object.keys(permissions).length > 0;
    const hasAccess = (key) => permissions[key] !== "X";
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasReadPermission = (key) => permissions[key] === "R";

    const [error, setError] = useState("");

    const [futurs, setFuturs] = useState([]);
    const [futurProves, setFuturProves] = useState([]);

    const [topMenuReady, setTopMenuReady] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const currentEsdevenimentId = futurs.length > 0 ? futurs[0].id : null;

    const [assistenciaByEvent, setAssistenciaByEvent] = useState({});

    const [notificacions, setNotificacions] = useState([]);

    const getStats = (id) => {
        const assistencia = assistenciaByEvent[id] || [];

        return {
            ok: assistencia.filter(a => a.confirmacio_previa === "si").length,
            ko: assistencia.filter(a => a.confirmacio_previa === "no").length,
            unknown: assistencia.filter(a => a.confirmacio_previa === "no_sap").length,
        };
    };

    const { setCurrentEvent } = useEvent();

    const loadFutureEsdeveniments = async () => {
        try {
            const data = await getCollesFutureEsdeveniments();
            let result = data;

            if (hasWritePermission("esdeveniments")) {
                result = data.slice(0, 4);

            } else if (hasReadPermission("esdeveniments")) {
                result = data.filter(e => e.visible === true).slice(0, 4);
            } else {
                result = [];
            }

            setFuturs(result);
            setCurrentEvent(result[0]);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadAssistencia = async (idEsdeveniment) => {
        try {
            const data = await getAssistenciaByEsdeveniment(idEsdeveniment);
            setAssistenciaByEvent(prev => ({
                ...prev,
                [idEsdeveniment]: data
            }));
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadProves = async (idEsdeveniment) => {
        try {
            const data = await getProvesByEsdeveniment(idEsdeveniment);
            setFuturProves(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadNotifications = async () => {
        try {
            const data = await getNotifications();

            let result = data;
            result = data.slice(0, 2);

            setNotificacions(result);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        if (!refreshKey) return;
        loadFutureEsdeveniments();
        loadNotifications();
    }, [refreshKey]);

    useEffect(() => {
        if (futurs.length > 0) {
            futurs.forEach(e => {
                loadAssistencia(e.id);
            });
            loadProves(futurs[0].id);
        }
    }, [futurs]);

    return (
        <div>
            <TopMenu
                title="Dashboard"
                canvi_colla
                onReady={() => setRefreshKey(prev => prev + 1)}
            />
            <div className="dashboard-grid">
                <div className="left-column-dashboard">
                    <div className="dashboard-grid-esdeveniment">
                        <div className="upper-esdeveniments-part">
                            <span>{futurs.length > 0 ? futurs[0].nom : "No hi ha esdeveniments"}</span>

                            {futurs.length > 0 && (() => {
                                const stats = getStats(futurs[0].id);

                                return (
                                    <>
                                        <div className="dashboard-numbers-assistance">
                                            <div className="dashboard-assistencia-ok">{stats.ok}</div>
                                            <div className="dashboard-assistencia-ko">{stats.ko}</div>
                                            <div className="dashboard-assistencia-unknown">{stats.unknown}</div>
                                        </div>

                                        <Button
                                            text="Consultar"
                                            icon={<FaRegEye />}
                                            action={() => {
                                                navigate(`/consult_esdeveniment?idEsdeveniment=${futurs[0].id}`);
                                            }}
                                        />
                                    </>
                                );
                            })()}
                        </div>
                        <hr />
                        <div className="lower-esdeveniments-part">
                            {futurs.length > 0 ? (
                                <>
                                    <Button
                                        text="Assistència"
                                        icon={<FaUsers />}
                                        action={() => {
                                            if (hasWritePermission("esdeveniments")) {
                                                navigate(`/assistencia?idEsdeveniment=${futurs[0].id}&nomEsdeveniment=${encodeURIComponent(futurs[0].nom)}`);
                                            } else if (hasReadPermission("esdeveniments")) {
                                                navigate(`/assistencia_usuari?idEsdeveniment=${futurs[0].id}`)
                                            }
                                        }}
                                    />
                                    <div className='grid-assistencia-dashboard'>
                                        <div
                                            className={`numbers-assistencia-usuari-element-ok`}
                                            onClick={() => {
                                                navigate(`/assistencia_usuari?idEsdeveniment=${futurs[0].id}&estatInicial=si`)
                                            }}>
                                            <FaCheck />
                                        </div>
                                        <div
                                            className={`numbers-assistencia-usuari-element-ko`}
                                            onClick={() => {
                                                navigate(`/assistencia_usuari?idEsdeveniment=${futurs[0].id}&estatInicial=no`)
                                            }}>
                                            <FaTimes />
                                        </div>

                                        <div
                                            className={`numbers-assistencia-usuari-element-unknown`}
                                            onClick={() => {
                                                navigate(`/assistencia_usuari?idEsdeveniment=${futurs[0].id}&estatInicial=no_sap`)
                                            }}>
                                            <FaQuestion />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span>Crea un esdeveniment per modificar l'assistència</span>
                                </>
                            )}

                        </div>
                    </div>
                    <div className="dashboard-grid-proves">
                        <div className="upper-proves-part" onClick={() => {
                            navigate(`/proves?idEsdeveniment=${futurs[0].id}&nomEsdeveniment=${encodeURIComponent(futurs[0].nom)}`);
                        }}>
                            {futurs.length > 0 ? (
                                <>
                                    <div className="dashboard-grid-propers-esdeveniments-title">
                                        <span>{futurs.length > 0 ? `Proves ${futurs[0].nom}` : "No hi ha proves"}</span>
                                        <FaClipboardList />
                                    </div>
                                </>) : (<>
                                    <span>Crea un esdeveniment per crear proves</span>
                                </>)}
                        </div>
                        <hr />
                        <div className="lower-proves-part">
                            <div className="grid-proves-list-dashboard">
                                {futurProves.map((prova) => (
                                    (hasAccess("proves") || prova.public) && (
                                        <div key={prova.id} className="container-proves-dashboard" onClick={() => {
                                            if (hasWritePermission('proves')) {
                                                navigate(`/proves_board_edit?id=${prova.id}&idEsdeveniment=${futurs[0].id}&nomEsdeveniment=${encodeURIComponent(futurs[0].nom)}`)
                                            } else {
                                                navigate(`/proves_board_show?id=${prova.id}&idEsdeveniment=${futurs[0].id}&nomEsdeveniment=${encodeURIComponent(futurs[0].nom)}`)
                                            }
                                        }}>
                                            <div className="container-proves-text-dashboard">
                                                <span>{prova.nom}</span>
                                            </div>
                                            <div className="container-proves-icons-dashboard">
                                                {prova.xarxa && (
                                                    <FaHashtag title="Amb xarxa" />
                                                )}
                                                {prova.feta ? (

                                                    <FaCheckCircle title="Realitzada" className="icon-feta-dashboard" />
                                                ) : (
                                                    <FaTimesCircle title="No realitzada" className="icon-no-feta-dashboard" />
                                                )}
                                            </div>
                                        </div>
                                    )
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="right-column-dashboard">
                    <div className="dashboard-grid-notificacions">
                        <div className="dashboard-grid-propers-esdeveniments-title" onClick={() => {
                            navigate("/notificacions_board");
                        }}>
                            <span>Darreres notificacions</span>
                            <FaCommentDots />
                        </div>
                        <hr />
                        {notificacions.length > 0 ? (
                            <>
                                {notificacions.map((notificacio) => {
                                    return (
                                        <div key={notificacio.id}>
                                            <div
                                                className="dashboard-grid-propers-esdeveniments-element"
                                                onClick={() => {

                                                }}
                                            >
                                                <div className="dashboard-grid-propers-esdeveniments-element-left">
                                                    <div className="dashboard-grid-propers-esdeveniments-element-left-title">
                                                        {notificacio.nom_emisor} - {new Date(notificacio.data_programacio).toLocaleDateString("es-ES")}
                                                    </div>
                                                    <div className="dashboard-grid-propers-esdeveniments-element-left-datetime">
                                                        {notificacio.titol}
                                                    </div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <span>No tens notificacions</span>
                        )}
                    </div>
                    <div className="dashboard-grid-propers-esdeveniments">
                        <div className="dashboard-grid-propers-esdeveniments-title" onClick={() => {
                            navigate("/esdeveniments");
                        }}>
                            <span>Propers esdeveniments</span>
                            <FaCalendarAlt />
                        </div>
                        <hr />
                        {futurs.length > 0 ? (
                            <>
                                {futurs.map((esdeveniment) => {
                                    if (!(esdeveniment.visible || hasWritePermission("esdeveniments"))) return null;

                                    const stats = getStats(esdeveniment.id);

                                    return (
                                        <div key={esdeveniment.id}>
                                            <div
                                                className="dashboard-grid-propers-esdeveniments-element"
                                                onClick={() => {
                                                    navigate(`/consult_esdeveniment?idEsdeveniment=${esdeveniment.id}`);
                                                }}
                                            >
                                                <div className="dashboard-grid-propers-esdeveniments-element-left">
                                                    <div className="dashboard-grid-propers-esdeveniments-element-left-title">
                                                        {esdeveniment.nom}
                                                    </div>
                                                    <div className="dashboard-grid-propers-esdeveniments-element-left-datetime">
                                                        {new Date(esdeveniment.data_esdeveniment).toLocaleDateString("es-ES")}, {esdeveniment.hora}
                                                    </div>
                                                </div>

                                                <div className="dashboard-grid-propers-esdeveniments-element-right">
                                                    <div className="dashboard-assistencia-ok">{stats.ok}</div>
                                                    <div className="dashboard-assistencia-ko">{stats.ko}</div>
                                                    <div className="dashboard-assistencia-unknown">{stats.unknown}</div>
                                                </div>
                                            </div>
                                            <hr />
                                        </div>
                                    );
                                })}
                            </>
                        ) : (
                            <span>No existeixen futurs esdeveniments</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 