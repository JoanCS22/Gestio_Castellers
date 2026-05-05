import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPermissions } from "../utils/utils.jsx"

import { FaPencilAlt, FaUsers, FaRegEye, FaCalendarAlt, FaCheck, FaTimes, FaQuestion } from "react-icons/fa";

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Dashboard.css";

import { useEvent } from "../utils/EventContext.jsx"

function Dashboard() {
    const navigate = useNavigate();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const permissionsReady = permissions && Object.keys(permissions).length > 0;
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasReadPermission = (key) => permissions[key] === "R";

    const [futurs, setFuturs] = useState([]);

    const [topMenuReady, setTopMenuReady] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const currentEsdevenimentId = futurs.length > 0 ? futurs[0].id : null;

    const [assistenciaByEvent, setAssistenciaByEvent] = useState({});

    const getStats = (id) => {
        const assistencia = assistenciaByEvent[id] || [];

        return {
            ok: assistencia.filter(a => a.confirmacio_previa === "si").length,
            ko: assistencia.filter(a => a.confirmacio_previa === "no").length,
            unknown: assistencia.filter(a => a.confirmacio_previa === "no_sap").length,
        };
    };

    const { setCurrentEvent } = useEvent();

    const getCollesFutureEsdeveniments = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        if (!idColla) {
            return;
        }

        const response = await fetch(`http://localhost:5000/esdeveniments/getFutureEsdeveniments?id=${idColla}`, {
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
            console.log("{DEBUG} Get colla's future esdeveniments OK")
        } else {
            console.log("{DEBUG} Get colla's future esdeveniments KO")
            setError(data.message);
        }
    }

    const getAssistenciaByEsdeveniment = async (idEsdeveniment) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/assistencia/getAssistenciaList?id=${idEsdeveniment}`, {
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
            setAssistenciaByEvent(prev => ({
                ...prev,
                [idEsdeveniment]: data
            }));
            console.log("{DEBUG} Get esdeveniment's assistencia OK")
        } else {
            console.log("{DEBUG} Get esdeveniment's assistencia KO")
            setError(data.message);
        }
    }

    useEffect(() => {
        if (!refreshKey) return;
        getCollesFutureEsdeveniments();
    }, [refreshKey]);

    useEffect(() => {
        if (futurs.length > 0) {
            futurs.forEach(e => {
                getAssistenciaByEsdeveniment(e.id);
            });
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

                    </div>
                </div>

                <div className="right-column-dashboard">
                    <div className="dashboard-grid-notificacions">
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