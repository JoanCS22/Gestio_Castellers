import {
    getAssistenciaActual, modifyAssistenciaPrevia, verifyCode
} from "../services/assistenciaService.js";
import { getEsdevenimentInfo } from "../services/esdevenimentsService.js";
import { handleApiError } from "../utils/handleApiError.js";

import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaCheckDouble, FaSave, FaCheck, FaTimes,
    FaQuestion, FaPaperPlane, FaTimesCircle
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import './Assistencia_Usuari.css';
import TopMenu from "../components/TopMenu";

const AssistenciaUsuari = () => {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { currentColla } = useColla();

    const params          = new URLSearchParams(location.search);
    const id_esdeveniment = params.get("idEsdeveniment");
    const initial_state   = params.get("estatInicial");

    const [message, setTempMessage]   = useState(null);
    const [error, setError]           = useState("");
    const [showModal, setShowModal]   = useState(false);
    const [modalText, setModalText]   = useState("");

    const [currentEsdeveniment, setCurrentEsdeveniment] = useState({
        nom: "", data: "", hora: "", codi: ""
    });
    const [acompanyat, setAcompanyat] = useState(false);
    const [bus,        setBus]        = useState(false);
    const [tipus,      setTipus]      = useState("Assaig");

    const [currentAssistance, setCurrentAssistance] = useState({
        id: 0, comentari: "", num_acompanyants: 0, temps_tard: 0, temps_aviat: 0
    });

    const [assistenciaSeleccionada, setAssistenciaSeleccionada] = useState(null);
    const [busAssistencia, setBusAssistencia] = useState(false);
    const [arribaTard,     setArribaTard]     = useState(false);
    const [marxaAviat,     setMarxaAviat]     = useState(false);

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentAssistance(prev => ({ ...prev, [name]: value }));
    };

    const loadEsdevenimentInfo = async () => {
        try {
            const data = await getEsdevenimentInfo(id_esdeveniment);
            setCurrentEsdeveniment({
                nom: data.nom,
                data: data.data_esdeveniment.split("T")[0],
                hora: data.hora,
                codi: data.codi_confirmacio,
            });
            setTipus(data.tipus);
            setAcompanyat(data.acompanyat);
            setBus(data.bus);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadAssistenciaActual = async () => {
        try {
            const data = await getAssistenciaActual(id_esdeveniment);
            setCurrentAssistance({
                id: data.id,
                comentari: data.comentari,
                num_acompanyants: data.num_acompanyants,
                temps_tard: data.temps_tard,
                temps_aviat: data.temps_aviat,
            });
            setAssistenciaSeleccionada(initial_state ?? data.confirmacio_previa);
            setBusAssistencia(data.bus);
            setArribaTard(data.arriba_tard);
            setMarxaAviat(data.marxa_aviat);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const modifyAssistenciaPreviaCall = async () => {
        if (!assistenciaSeleccionada) {
            setError("Has de seleccionar algun valor d'assistència");
            return;
        }
        try {
            await modifyAssistenciaPrevia(
                id_esdeveniment, currentAssistance,
                assistenciaSeleccionada, busAssistencia, arribaTard, marxaAviat
            );
            setError("");
            showTempMessage("Assistència modificada correctament.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const verifyCodeCall = async () => {
        if (modalText !== currentEsdeveniment.codi) {
            setError("Codi incorrecte");
            return;
        }
        try {
            await verifyCode(currentAssistance.id, "si");
            setModalText("");
            setShowModal(false);
            setError("");
            showTempMessage("Assistència confirmada correctament.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    useEffect(() => {
        loadEsdevenimentInfo();
        loadAssistenciaActual();
    }, []);

    return (
        <div>
            <TopMenu title={`Assistència ${currentEsdeveniment.nom}`} tornar />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="assistencia-usuari-page">

                <div className="assistencia-usuari-subtitle">
                    <span className="assistencia-usuari-badge">{tipus}</span>
                    <p className="assistencia-usuari-title">
                        {tipus} el dia {new Date(currentEsdeveniment.data).toLocaleDateString("ca-ES")} a les {currentEsdeveniment.hora}
                    </p>
                </div>

                <div className="assistencia-usuari-form">

                    <div className="form-section">
                        <span className="form-section-label">La meva assistència</span>
                        <div className="attendance-buttons">
                            <button
                                type="button"
                                className={`attendance-btn attendance-btn--ok ${assistenciaSeleccionada === "si" ? "active" : ""}`}
                                onClick={() => setAssistenciaSeleccionada("si")}
                            >
                                <FaCheck /> VINC
                            </button>
                            <button
                                type="button"
                                className={`attendance-btn attendance-btn--ko ${assistenciaSeleccionada === "no" ? "active" : ""}`}
                                onClick={() => setAssistenciaSeleccionada("no")}
                            >
                                <FaTimes /> NO VINC
                            </button>
                            <button
                                type="button"
                                className={`attendance-btn attendance-btn--unknown ${assistenciaSeleccionada === "no_sap" ? "active" : ""}`}
                                onClick={() => setAssistenciaSeleccionada("no_sap")}
                            >
                                <FaQuestion /> DUBTE
                            </button>
                        </div>
                    </div>

                    <div className="form-row-2">
                        {(bus && tipus !== "Assaig") && (
                            <div className="toggle-card">
                                <label className="toggle-card-row">
                                    <input
                                        type="checkbox"
                                        checked={busAssistencia}
                                        onChange={e => setBusAssistencia(e.target.checked)}
                                    />
                                    <span className="toggle-card-label">Vaig amb bus</span>
                                </label>
                            </div>
                        )}
                        {acompanyat && (
                            <div className="companions-field">
                                <label htmlFor="num_acompanyants">Acompanyants</label>
                                <input
                                    id="num_acompanyants"
                                    name="num_acompanyants"
                                    type="number"
                                    min="0"
                                    value={currentAssistance.num_acompanyants}
                                    onChange={handleChange}
                                />
                            </div>
                        )}
                    </div>

                    <div className="form-row-2">
                        <div className="toggle-card">
                            <label className="toggle-card-row">
                                <input
                                    type="checkbox"
                                    checked={arribaTard}
                                    onChange={e => setArribaTard(e.target.checked)}
                                />
                                <span className="toggle-card-label">Arribo tard</span>
                            </label>
                            {arribaTard && (
                                <>
                                    <span className="toggle-card-sub">Quant? (en minuts)</span>
                                    <input
                                        name="temps_tard"
                                        type="number"
                                        min="0"
                                        value={currentAssistance.temps_tard}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                        </div>

                        <div className="toggle-card">
                            <label className="toggle-card-row">
                                <input
                                    type="checkbox"
                                    checked={marxaAviat}
                                    onChange={e => setMarxaAviat(e.target.checked)}
                                />
                                <span className="toggle-card-label">Marxo d'hora</span>
                            </label>
                            {marxaAviat && (
                                <>
                                    <span className="toggle-card-sub">Quant? (en minuts)</span>
                                    <input
                                        name="temps_aviat"
                                        type="number"
                                        min="0"
                                        value={currentAssistance.temps_aviat}
                                        onChange={handleChange}
                                    />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="comment-field">
                        <label htmlFor="comentari">Comentari</label>
                        <textarea
                            id="comentari"
                            name="comentari"
                            rows={3}
                            placeholder="Escriu qualsevol observació aquí..."
                            value={currentAssistance.comentari}
                            onChange={handleChange}
                        />
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="assistencia-actions">
                        <button className="btn-save-assistencia" type="button" onClick={modifyAssistenciaPreviaCall}>
                            <FaSave /> Guardar assistència
                        </button>
                        <button className="btn-confirm-assistencia" type="button" onClick={() => setShowModal(true)}>
                            <FaCheckDouble /> Confirmació in situ
                        </button>
                    </div>

                </div>
            </div>

            {showModal && (
                <div className="modal-overlay-assistencia">
                    <div className="modal-assistencia">
                        <h2>Verificar codi</h2>
                        <div className="input-assistencia">
                            <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-xs)" }}>
                                <label style={{ fontSize: "var(--text-label-md)", fontWeight: "600", color: "var(--on-surface-variant)" }}>
                                    Codi
                                </label>
                                <input
                                    type="text"
                                    placeholder="Codi"
                                    value={modalText}
                                    onChange={e => setModalText(e.target.value)}
                                    style={{
                                        padding: "var(--space-sm) var(--space-md)",
                                        border: "1px solid var(--outline-variant)",
                                        borderRadius: "var(--radius-md)",
                                        fontFamily: "var(--font-base)",
                                        fontSize: "var(--text-body-md)",
                                        outline: "none",
                                        width: "100%",
                                        boxSizing: "border-box"
                                    }}
                                />
                            </div>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="modal-buttons-assistencia">
                            <button className="btn-confirm-assistencia" onClick={() => { setShowModal(false); setError(""); }}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                            <button className="btn-save-assistencia" onClick={verifyCodeCall}>
                                <FaPaperPlane /> Verificar codi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssistenciaUsuari;