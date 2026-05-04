import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

import { FaSearch, FaCheckDouble, FaCheck, FaPencilAlt, FaTimes, FaQuestion, FaRegQuestionCircle } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import './Assistencia_Llistat.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

const LlistatAssistencia = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const idEsdeveniment = params.get("idEsdeveniment");
    const nomEsdeveniment = params.get("nomEsdeveniment");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasAccess = (key) => permissions[key] !== "X";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [loadingIds, setLoadingIds] = useState([]);

    const [assistencia, setAssistencia] = useState([]);

    const stats = {
        ok: assistencia.filter(a => a.confirmacio_previa === "si").length,
        ko: assistencia.filter(a => a.confirmacio_previa === "no").length,
        unknown: assistencia.filter(a => a.confirmacio_previa === "no_sap").length,
        pendent: assistencia.filter(a => a.confirmacio_previa === "pendent").length,
        final: assistencia.filter(a => a.confirmacio_arribada === "si").length
    };

    const cicle = {
        si: "no",
        no: "no_sap",
        no_sap: "si"
    };

    const estatPrevi = (memberId, currentValue) => {
        const newValue = cicle[currentValue] || "si";

        setAssistencia(prev =>
            prev.map(m =>
                m.id === memberId
                    ? { ...m, confirmacio_previa: newValue }
                    : m
            )
        );

        return newValue;
    };

    const estatArribada = (memberId, currentValue) => {
        const newValue = cicle[currentValue] || "si";

        setAssistencia(prev =>
            prev.map(m =>
                m.id === memberId
                    ? { ...m, confirmacio_arribada: newValue }
                    : m
            )
        );

        return newValue;
    };

    const renderIcon = (value) => {
        switch (value) {
            case "si":
                return <FaCheck className="list-assistencia-ok" />;
            case "no":
                return <FaTimes className="list-assistencia-ko" />;
            case "no_sap":
                return <FaQuestion className="list-assistencia-unknown" />;
            case "pendent":
                return <FaRegQuestionCircle className="list-assistencia-pendant" />;
        }
    };

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 1000);
    };

    const modifyAssistenciaPreviaTecnica = async (idAssistencia, confirmacio_previa) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/assistencia/modifyAssistenciaPreviaTecnica?id=${idAssistencia}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                confirmacio_previa: confirmacio_previa
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            setError("");
            showTempMessage("Assistència previa modificada correctament.");
            console.log("{DEBUG} Modify esdeveniment's assistencia previa OK")
        } else {
            console.log("{DEBUG} Modify esdeveniment's assistencia previa KO")
            setError(data.message);
        }
    }

    const confirmAssistenciaTecnica = async (idAssistencia, confirmacio_arribada) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/assistencia/confirmAssistencia?id=${idAssistencia}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                confirmacio_arribada: confirmacio_arribada
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            setError("");
            showTempMessage("Assistència arribada modificada correctament.");
            console.log("{DEBUG} Modify esdeveniment's assistencia arribada OK")
        } else {
            console.log("{DEBUG} Modify esdeveniment's assistencia arribada KO")
            setError(data.message);
        }
    }

    const getAssistenciaByEsdeveniment = async () => {

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
            setAssistencia(data);
            console.log("{DEBUG} Get esdeveniment's assistencia OK")
        } else {
            console.log("{DEBUG} Get esdeveniment's assistencia KO")
            setError(data.message);
        }
    }

    useEffect(() => {
        getAssistenciaByEsdeveniment();
    }, []);

    return (
        <div>
            <TopMenu
                title={`Assistència ${nomEsdeveniment}`}
            />

            {
                message && (
                    <div className={`message ${message.type}`}>
                        {message.message}
                    </div>
                )
            }

            <div className="button-section-assistencia-llistat">
                <Button
                    text="La meva assistència"
                    icon={<FaPencilAlt />}
                    action={() => {
                        navigate(`/assistencia_usuari?idEsdeveniment=${idEsdeveniment}`);
                    }}
                />
            </div>

            <div className="filters-llistat-assistencia">
                <div className="search-bar-llistat-assistencia">
                    <span>Cercar:</span>
                    <FaSearch className="search-icon-tags" />
                    <input type='search' placeholder='Cercar...'></input>
                </div>
                <div className="numbers-llistat-assistencia">
                    <div className="numbers-llistat-assistencia-element">
                        <FaCheckDouble />
                        <div className="dashboard-assistencia-doble">{stats.final}</div>
                    </div>
                    <div className="numbers-llistat-assistencia-element">
                        <FaCheck />
                        <div className="dashboard-assistencia-ok">{stats.ok}</div>
                    </div>
                    <div className="numbers-llistat-assistencia-element">
                        <FaTimes />
                        <div className="dashboard-assistencia-ko">{stats.ko}</div>
                    </div>
                    <div className="numbers-llistat-assistencia-element">
                        <FaQuestion />
                        <div className="dashboard-assistencia-unknown">{stats.unknown}</div>
                    </div>
                    <div className="numbers-llistat-assistencia-element">
                        <FaRegQuestionCircle />
                        <div className="dashboard-assistencia-pendant">{stats.pendent}</div>
                    </div>
                </div>
            </div>

            <div className="table-llistat-assistencia">
                <table>
                    <colgroup>
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "45%" }} />
                        <col style={{ width: "15%" }} />

                    </colgroup>

                    <thead>
                        <tr>
                            <th>Sobrenom</th>
                            <th><FaCheck /></th>
                            <th><FaCheckDouble /></th>
                            <th>Acompanyants</th>
                            <th>Comentari</th>
                            <th>Actualització</th>
                        </tr>
                    </thead>
                    <tbody>
                        {assistencia.map((assist) => (
                            <>
                                <tr key={assist.id}>
                                    <td>{assist.mote}</td>
                                    <td
                                        className={loadingIds.includes(assist.id) ? "loading-assistencia" : ""}
                                        onClick={() => {
                                            if (loadingIds.includes(assist.id)) return;

                                            const newValue = estatPrevi(assist.id, assist.confirmacio_previa);

                                            setLoadingIds(prev => [...prev, assist.id]);

                                            modifyAssistenciaPreviaTecnica(assist.id, newValue)
                                                .finally(() => {
                                                    setLoadingIds(prev => prev.filter(id => id !== assist.id));
                                                });
                                        }}
                                    >
                                        {renderIcon(assist.confirmacio_previa)}
                                    </td>
                                    <td
                                        className={loadingIds.includes(assist.id) ? "loading-assistencia" : ""}
                                        onClick={() => {
                                            if (loadingIds.includes(assist.id)) return;

                                            const newValue = estatArribada(assist.id, assist.confirmacio_arribada);

                                            setLoadingIds(prev => [...prev, assist.id]);

                                            confirmAssistenciaTecnica(assist.id, newValue)
                                                .finally(() => {
                                                    setLoadingIds(prev => prev.filter(id => id !== assist.id));
                                                });
                                        }}
                                    >
                                        {renderIcon(assist.confirmacio_arribada)}
                                    </td>
                                    <td>{assist.num_acompanyants}</td>
                                    <td>{assist.comentari}</td>
                                    <td>  {new Date(assist.data_actualitzacio).toLocaleString("es-ES")}</td>
                                </tr >
                            </>
                        ))}
                    </tbody>
                </table>
            </div>

        </div>
    )
}

export default LlistatAssistencia;