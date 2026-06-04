import { getEsdevenimentInfo, createEsdeveniment, modifyEsdeveniment } from "../services/esdevenimentsService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaSave, FaTimesCircle, FaPencilAlt, FaPlusSquare,
    FaRegEye, FaClipboardList, FaMapMarkerAlt, FaCog, FaCalendarAlt
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import TopMenu from "../components/TopMenu";

import "./Esdeveniments_Info.css";

function EsdevenimentsInfo() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { currentColla } = useColla();

    const params          = new URLSearchParams(location.search);
    const idEsdeveniment  = params.get("idEsdeveniment");

    const permissions         = getPermissions();
    const hasWritePermission  = (key) => permissions[key] === "W";

    const isModify  = location.pathname === "/modify_esdeveniment";
    const isConsult = location.pathname === "/consult_esdeveniment";
    const isCreate  = location.pathname === "/create_esdeveniment";
    const isReadOnly = isConsult;

    const [message, setTempMessage] = useState(null);
    const [error, setError]         = useState("");
    const [showModal, setShowModal] = useState(false);

    const [form, setForm] = useState({
        nom: "", data: "", hora: "", durada: "",
        adreca: "", link_adreca: "", info_extra: "",
        data_inscripcions: "", codi: "",
    });

    const [visible,      setVisible]      = useState(false);
    const [acompanyat,   setAcompanyat]   = useState(false);
    const [bus,          setBus]          = useState(false);
    const [tipus,        setTipus]        = useState("Assaig");
    const [tipusAltres,  setTipusAltres]  = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const generateCode = (long = 6) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        return Array.from({ length: long }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    const validate = () => {
        const required = { nom: "Nom", data: "Data", hora: "Hora", durada: "Durada", adreca: "Adreça", data_inscripcions: "Data Inscripcions" };
        for (const key in required) {
            if (!form[key]?.toString().trim()) {
                setError(`El camp "${required[key]}" és obligatori`);
                return false;
            }
        }
        if (tipus === "Altres" && !tipusAltres.trim()) {
            setError("Has d'especificar el tipus si selecciones 'Altres'");
            return false;
        }
        return true;
    };

    const createEsdevenimentCall = async () => {
        if (!validate()) return;
        try {
            const code = generateCode();
            const data = await createEsdeveniment(currentColla.id, form, tipus, visible, acompanyat, bus, code);
            setError("");
            showTempMessage("Esdeveniment creat correctament.");
            navigate(`/consult_esdeveniment?idEsdeveniment=${data.id}`);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const modifyEsdevenimentCall = async () => {
        if (!validate()) return;
        try {
            await modifyEsdeveniment(idEsdeveniment, form, tipus, visible, acompanyat, bus);
            setError("");
            showTempMessage("Esdeveniment modificat correctament.");
            navigate(`/consult_esdeveniment?idEsdeveniment=${idEsdeveniment}`);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadEsdeveniment = async () => {
        try {
            const data = await getEsdevenimentInfo(idEsdeveniment);
            setForm({
                nom:               data.nom,
                data:              data.data_esdeveniment.split("T")[0],
                hora:              data.hora,
                durada:            data.duracio,
                adreca:            data.adreca,
                link_adreca:       data.link_adreca,
                data_inscripcions: data.data_inici_inscripcions.split("T")[0],
                info_extra:        data.info_addicional,
                codi:              data.codi_confirmacio,
            });
            setTipus(data.tipus);
            setVisible(data.visible);
            setAcompanyat(data.acompanyat);
            setBus(data.bus);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    useEffect(() => {
        if (isConsult || isModify) loadEsdeveniment();
    }, [isConsult]);

    const pageTitle = isCreate ? "Crear esdeveniment" : form.nom || "Esdeveniment";

    return (
        <div>
            <TopMenu title={pageTitle} tornar />

            {message && (
                <div className={`message ${message.type}`}>{message.message}</div>
            )}

            <div className="esdeveniment-page">

                <div className="esdeveniment-two-cols">

                    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-lg)" }}>

                        <div className="esdeveniment-card">
                            <div className="esdeveniment-section-header">
                                <FaCalendarAlt />
                                <h3>Informació bàsica</h3>
                            </div>

                            <div className="esdeveniment-fields-grid">
                                <div className="esdeveniment-field col-span-2">
                                    <label>Nom de l'esdeveniment</label>
                                    <input name="nom" type="text" placeholder="Ex: Diada de Santa Tecla"
                                        value={form.nom} onChange={handleChange} readOnly={isReadOnly} />
                                </div>

                                <div className="esdeveniment-field">
                                    <label>Tipus d'acte</label>
                                    {isReadOnly ? (
                                        <input type="text" value={tipus} readOnly />
                                    ) : (
                                        <>
                                            <select value={tipus} onChange={e => setTipus(e.target.value)}>
                                                <option value="Assaig">Assaig</option>
                                                <option value="Actuacio">Actuació</option>
                                                <option value="Altres">Altres</option>
                                            </select>
                                            {tipus === "Altres" && (
                                                <input type="text" placeholder="Especifica el tipus"
                                                    value={tipusAltres}
                                                    onChange={e => setTipusAltres(e.target.value)}
                                                    style={{ marginTop: "var(--space-xs)" }}
                                                />
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="esdeveniment-field">
                                    <label>Data</label>
                                    <input name="data" type="date" value={form.data}
                                        onChange={handleChange} readOnly={isReadOnly} />
                                </div>

                                <div className="esdeveniment-field">
                                    <label>Hora d'inici</label>
                                    <input name="hora" type="time" value={form.hora}
                                        onChange={handleChange} readOnly={isReadOnly} />
                                </div>

                                <div className="esdeveniment-field">
                                    <label>Durada estimada (minuts)</label>
                                    <input name="durada" type="text" placeholder="120"
                                        value={form.durada} onChange={handleChange} readOnly={isReadOnly} />
                                </div>
                            </div>
                        </div>

                        <div className="esdeveniment-card">
                            <div className="esdeveniment-section-header">
                                <FaMapMarkerAlt />
                                <h3>Ubicació</h3>
                            </div>
                            <div className="esdeveniment-fields-grid">
                                <div className="esdeveniment-field">
                                    <label>Adreça</label>
                                    <input name="adreca" type="text" placeholder="Plaça de la Vila, 1"
                                        value={form.adreca} onChange={handleChange} readOnly={isReadOnly} />
                                </div>
                                <div className="esdeveniment-field">
                                    <label>Enllaç Google Maps</label>
                                    <input name="link_adreca" type="url" placeholder="https://goo.gl/maps/..."
                                        value={form.link_adreca} onChange={handleChange} readOnly={isReadOnly} />
                                </div>
                            </div>
                        </div>

                        <div className="esdeveniment-card">
                            <div className="esdeveniment-field">
                                <label>Informació extra i observacions</label>
                                <textarea name="info_extra" rows={4}
                                    placeholder="Detalls importants, requeriments tècnics..."
                                    value={form.info_extra} onChange={handleChange}
                                    readOnly={isReadOnly} />
                            </div>
                        </div>
                    </div>

                    <div className="esdeveniment-right-col">

                        <div className="esdeveniment-card">
                            <div className="esdeveniment-section-header">
                                <FaCog />
                                <h3>Logística</h3>
                            </div>
                            <div className="logistica-list">
                                <label className="logistica-item">
                                    <span>Amb acompanyants?</span>
                                    <input type="checkbox" checked={acompanyat}
                                        onChange={e => { if (!isReadOnly) setAcompanyat(e.target.checked); }}
                                        disabled={isReadOnly} />
                                </label>
                                <label className="logistica-item">
                                    <span>Servei de bus?</span>
                                    <input type="checkbox" checked={bus}
                                        onChange={e => { if (!isReadOnly) setBus(e.target.checked); }}
                                        disabled={isReadOnly} />
                                </label>
                                {!isConsult && (
                                    <label className="logistica-item">
                                        <span>Visible al calendari?</span>
                                        <input type="checkbox" checked={visible}
                                            onChange={e => setVisible(e.target.checked)} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {!isConsult && (
                            <div className="esdeveniment-card">
                                <div className="esdeveniment-section-header">
                                    <FaCalendarAlt />
                                    <h3>Inscripcions</h3>
                                </div>
                                <div className="esdeveniment-field">
                                    <label>Data inici inscripcions</label>
                                    <input name="data_inscripcions" type="date"
                                        value={form.data_inscripcions} onChange={handleChange} />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="esdeveniment-actions">
                    {isConsult && (
                        <>
                            {hasWritePermission("esdeveniments") && (
                                <>
                                    <button className="btn-event-primary"
                                        onClick={() => navigate(`/modify_esdeveniment?idEsdeveniment=${idEsdeveniment}`)}>
                                        <FaPencilAlt /> Modificar
                                    </button>
                                    <button className="btn-event-secondary"
                                        onClick={() => setShowModal(true)}>
                                        <FaRegEye /> Mostrar codi
                                    </button>
                                </>
                            )}
                            <button className="btn-event-secondary"
                                onClick={() => navigate("/esdeveniments")}>
                                <FaClipboardList /> Llista esdeveniments
                            </button>
                        </>
                    )}

                    {isModify && (
                        <>
                            {hasWritePermission("esdeveniments") && (
                                <button className="btn-event-primary" onClick={modifyEsdevenimentCall}>
                                    <FaSave /> Guardar canvis
                                </button>
                            )}
                            <button className="btn-event-secondary"
                                onClick={() => { navigate(-1); setError(""); }}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                        </>
                    )}

                    {isCreate && (
                        <>
                            {hasWritePermission("esdeveniments") && (
                                <button className="btn-event-primary" onClick={createEsdevenimentCall}>
                                    <FaPlusSquare /> Crear esdeveniment
                                </button>
                            )}
                            <button className="btn-event-secondary"
                                onClick={() => { navigate(-1); setError(""); }}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                        </>
                    )}
                </div>
            </div>

            {showModal && (
                <div className="modal-overlay-esdeveniments">
                    <div className="modal-esdeveniments">
                        <span className="modal-codi-title">Codi de confirmació</span>
                        <span className="modal-codi-value">{form.codi}</span>
                        <div className="modal-buttons-esdeveniments">
                            <button className="btn-event-secondary"
                                onClick={() => setShowModal(false)}>
                                <FaTimesCircle /> Tancar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EsdevenimentsInfo;