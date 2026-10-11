import { createColla, getDataColla, updateDataColla } from "../services/collaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import {
    FaSave, FaTimesCircle, FaPencilAlt, FaPlusSquare,
    FaIdCard, FaMapMarkerAlt, FaHistory, FaPhone
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import TopMenu from "../components/TopMenu";
import "./Colla_Info.css";

function CollaInfo() {
    const navigate  = useNavigate();
    const location  = useLocation();
    const { currentColla, reloadColles } = useColla();

    const permissions        = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [form, setForm] = useState({
        nom: "", nom_curt: "", telefon: "", contactes: "",
        data_fundacio: "", adreca: "", poblacio: ""
    });
    const [error, setError]         = useState("");
    const [message, setTempMessage] = useState(null);
    const [foto, setFoto]           = useState("/prueba.jpg");

    const isCreate   = location.pathname === "/create_colla";
    const isModify   = location.pathname === "/modify_info_colla";
    const isReadOnly = location.pathname === "/get_data_colla";

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const createCollaCall = async (e) => {
        e.preventDefault();
        if (!form.nom) { setError("El camp nom no pot estar buit"); return; }
        try {
            const data = await createColla(form);
            setError("");
            localStorage.setItem("id_colla", data.id);
            await reloadColles();
            showTempMessage("Colla creada correctament.");
            navigate("/get_data_colla");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadDataColla = async () => {
        try {
            const data = await getDataColla(currentColla.id);
            setForm({
                nom:           data.nom,
                nom_curt:      data.abreviacio || "",
                telefon:       data.telefon,
                contactes:     data.correus_contacte || "",
                data_fundacio: data.data_creacio ? data.data_creacio.split("T")[0] : "",
                adreca:        data.adreca || "",
                poblacio:      data.poblacio || ""
            });
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const updateDataCollaCall = async (e) => {
        e.preventDefault();
        if (!form.nom) { setError("El camp nom no pot estar buit"); return; }
        try {
            await updateDataColla(currentColla.id, form);
            setError("");
            showTempMessage("Colla modificada correctament.");
            navigate("/get_data_colla");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    useEffect(() => {
        if (!isCreate) loadDataColla();
    }, []);

    const ro = isReadOnly; /* shorthand */

    return (
        <div>
            <TopMenu
                title={isCreate ? "Crear colla" : `Informació de ${form.nom}`}
                tornar={!isReadOnly}
            />

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            <div className="colla-page">
                <div className="colla-grid" style={{ alignItems: "stretch" }}>

                    <div className="colla-left-col">

                        <div className="colla-card">
                            <div className="colla-section-header">
                                <FaIdCard />
                                <h3>Identitat</h3>
                            </div>
                            <div className="colla-fields-grid">
                                <div className="colla-field">
                                    <label>Nom Oficial</label>
                                    <input name="nom" type="text" placeholder="Nom oficial"
                                        value={form.nom} onChange={handleChange} readOnly={ro} />
                                </div>
                                <div className="colla-field">
                                    <label>Nom Curt</label>
                                    <input name="nom_curt" type="text" placeholder="Abreviació"
                                        value={form.nom_curt} onChange={handleChange} readOnly={ro} />
                                </div>
                                <div className="colla-field colla-fields-grid--full">
                                    <label>Contactes (Email)</label>
                                    <input name="contactes" type="email" placeholder="info@colla.cat"
                                        value={form.contactes} onChange={handleChange} readOnly={ro} />
                                </div>
                            </div>
                        </div>

                        <div className="colla-card">
                            <div className="colla-section-header">
                                <FaMapMarkerAlt />
                                <h3>Localització</h3>
                            </div>
                            <div className="colla-fields-grid">
                                <div className="colla-field colla-fields-grid--full">
                                    <label>Adreça de l'Assaig</label>
                                    <input name="adreca" type="text" placeholder="Carrer, número..."
                                        value={form.adreca} onChange={handleChange} readOnly={ro} />
                                </div>
                                <div className="colla-field">
                                    <label>Població</label>
                                    <input name="poblacio" type="text" placeholder="Població"
                                        value={form.poblacio} onChange={handleChange} readOnly={ro} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="colla-right-col">

                        <div className="colla-logo-card">
                            <div className="colla-logo-wrap">
                                <img src={foto} alt="Logo de la colla" />
                                {!isCreate && (
                                    <button
                                        className="colla-logo-edit-btn"
                                        type="button"
                                        onClick={() => alert("Funcionalitat encara no implementada.")}
                                    >
                                        <FaPencilAlt style={{ fontSize: "12px" }} />
                                        Modificar logo
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="colla-card--accent">
                            <div className="colla-accent-section">
                                <div className="colla-accent-header">
                                    <FaHistory />
                                    <h3>Origen</h3>
                                </div>
                                <div className="colla-accent-field">
                                    <label>Fundació</label>
                                    <input name="data_fundacio" type="date"
                                        value={form.data_fundacio} onChange={handleChange}
                                        readOnly={ro} />
                                </div>
                            </div>

                            <hr className="colla-accent-divider" />

                            <div className="colla-accent-section">
                                <div className="colla-accent-header">
                                    <FaPhone />
                                    <h3>Contacte Directe</h3>
                                </div>
                                <div className="colla-accent-field">
                                    <label>Telèfon de la Colla</label>
                                    <input name="telefon" type="text" placeholder="+34 93 000 00 00"
                                        value={form.telefon} onChange={handleChange}
                                        readOnly={ro} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {error && <div className="error-message">{error}</div>}

                <div className="colla-actions">
                    {isCreate && (
                        <>
                            <button className="btn-colla-primary" onClick={createCollaCall}>
                                <FaPlusSquare /> Crear colla
                            </button>
                            <button className="btn-colla-secondary" onClick={() => navigate(-1)}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                        </>
                    )}

                    {isReadOnly && hasWritePermission("colla") && (
                        <button className="btn-colla-primary" onClick={() => navigate("/modify_info_colla")}>
                            <FaPencilAlt /> Modificar dades colla
                        </button>
                    )}

                    {isModify && (
                        <>
                            <button className="btn-colla-primary" onClick={updateDataCollaCall}>
                                <FaSave /> Guardar canvis
                            </button>
                            <button className="btn-colla-secondary" onClick={() => { loadDataColla(); navigate("/get_data_colla"); }}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CollaInfo;