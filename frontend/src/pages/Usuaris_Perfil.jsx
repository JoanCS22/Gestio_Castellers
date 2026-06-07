import {
    getData, updateData,
} from "../services/profileService.js";
import {
    getDataMember, modifyMember, deleteMember,
} from "../services/membersService.js";
import {
    getCollesPositions, getCollesRoles, getCollesGroups
} from "../services/collaService.js";
import { handleApiError } from "../utils/handleApiError.js";

import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { useColla } from "../context/CollaContext.jsx";

import {
    FaSave, FaTimesCircle, FaPencilAlt, FaUserAltSlash,
    FaIdCard, FaUsers
} from "react-icons/fa";

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import MultiSelectDropdown from "../components/MultiSelectDropdown";

import "./Usuaris_Perfil.css";

function UserProfile() {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentColla } = useColla();

    const params = new URLSearchParams(location.search);
    const userId = params.get("userId");
    const collaId = params.get("collaId");
    const isTecnica = location.pathname === '/tecnica_profile';

    const [form, setForm] = useState({
        nom: "", cognoms: "", mote: "", telefon: "", email: "",
        alcadaEspatlles: "", envergadura: "", pes: "", alcada: "",
        dataLesio: "", infoExtra: ""
    });

    const [genere, setGenere] = useState("M");
    const [lesionat, setLesionat] = useState(false);
    const [canalla, setCanalla] = useState(false);
    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);
    const [foto, setFoto] = useState("/prueba.jpg");

    const [existingGroups, setExistingGroups] = useState([]);
    const [existingPositions, setExistingPositions] = useState([]);
    const [existingRoles, setExistingRoles] = useState([]);
    const [selectedPositions, setSelectedPositions] = useState([]);
    const [selectedGroups, setSelectedGroups] = useState([]);
    const [selectedRole, setSelectedRole] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const comprovaNums = () => {
        const fields = [
            { name: "Telèfon", value: form.telefon },
            { name: "Alçada", value: form.alcada },
            { name: "Alçada espatlles", value: form.alcadaEspatlles },
            { name: "Envergadura", value: form.envergadura },
            { name: "Pes", value: form.pes }
        ];
        return fields
            .filter(f => {
                const v = String(f.value || "").trim();
                return v !== "" && (isNaN(v) || Number(v) <= 0);
            })
            .map(f => f.name);
    };

    const getDataProfile = async () => {
        try {
            const data = await getData(userId, currentColla?.id);
            setForm({
                nom: data.nom || "", cognoms: data.cognoms || "",
                telefon: data.telefon || "",
                email: data.email || "", alcadaEspatlles: data.altura_espatlles || "",
                envergadura: data.envergadura || "", pes: data.pes || "",
                alcada: data.altura_total || "", dataLesio: data.data_lesio || "",
                infoExtra: data.comentari || "", mote: data.mote || "",
            });
            setLesionat(data.lesionat || false);
            setGenere(data.genere || "altre");
            setCanalla(data.canalla || false);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    const getDataMemberCall = async () => {
        try {
            const data = await getDataMember(currentColla.id, userId);
            const row = data[0] || {};
            console.log(row.mote);
            setSelectedPositions((row.posicions_ids || []).map(String));
            setSelectedGroups(row.grups_ids || []);
            setSelectedRole(row.rol_id ? String(row.rol_id) : "");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadCollesPositions = async () => {
        try { setExistingPositions(await getCollesPositions(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadCollesGrups = async () => {
        try { setExistingGroups(await getCollesGroups(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadCollesRoles = async () => {
        try { setExistingRoles(await getCollesRoles(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const modifyDataProfile = async () => {
        const errors = comprovaNums();
        if (errors.length > 0) {
            setError(`Els camps han de ser numèrics i positius: ${errors.join(", ")}`);
            return;
        }
        try {
            await updateData(userId, form, lesionat, genere, canalla, currentColla?.id);
            setError("");
            showTempMessage("Informació general actualitzada correctament.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const modifyDataMember = async () => {
        if (!selectedRole) { setError("El camp de rol no pot estar buit."); return; }
        try {
            await modifyMember(currentColla.id, userId, selectedRole, selectedPositions, selectedGroups);
            setError("");
            showTempMessage("Dades del membre actualitzades correctament.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const deleteMemberFromColla = async () => {
        if (!window.confirm("Segur que vols eliminar a l'usuari de la colla?")) return;
        try {
            await deleteMember(currentColla.id, userId);
            showTempMessage("Usuari eliminat correctament de la colla.");
            setTimeout(() => navigate("/members"), 2000);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    useEffect(() => {
        getDataProfile();
        if (isTecnica) {
            getDataMemberCall();
            loadCollesRoles();
            loadCollesPositions();
            loadCollesGrups();
        }
    }, [userId, collaId, isTecnica]);

    return (
        <div>
            <TopMenu title={isTecnica ? `Dades ${form.mote}` : "Les meves dades"} tornar />

            {message && (
                <div className={`message ${message.type}`}>{message.message}</div>
            )}

            <div className="profile-page">
                <div className="profile-max-width">

                    <div className="profile-card">
                        <div className="profile-section-header">
                            <FaIdCard />
                            <h2>Dades Personals</h2>
                        </div>

                        <div className="profile-top-row">
                            <div className="profile-photo-wrap">
                                <img src={foto} alt="Foto de perfil" />
                                <button
                                    className="profile-photo-edit-btn"
                                    onClick={() => alert("Funcionalitat encara no implementada.")}
                                    type="button"
                                    title="Modificar foto"
                                >
                                    <FaPencilAlt />
                                </button>
                            </div>
                            <div className="profile-top-fields">
                                <div className="profile-field">
                                    <label>Nom</label>
                                    <input name="nom" type="text" placeholder="Nom"
                                        value={form.nom} onChange={handleChange} />
                                </div>
                                <div className="profile-field">
                                    <label>Cognoms</label>
                                    <input name="cognoms" type="text" placeholder="Cognoms"
                                        value={form.cognoms} onChange={handleChange} />
                                </div>
                            </div>
                        </div>

                        <div className="profile-fields-grid">
                            <div className="profile-field">
                                <label>Correu electrònic</label>
                                <input name="email" type="text" value={form.email}
                                    onChange={handleChange} readOnly />
                            </div>
                            <div className="profile-field">
                                <label>Telèfon</label>
                                <input name="telefon" type="text" placeholder="600 000 000"
                                    value={form.telefon} onChange={handleChange} />
                            </div>
                            <div className="profile-field">
                                <label>Gènere</label>
                                <div className="gender-toggle">
                                    {["M", "F", "altre"].map(g => (
                                        <button
                                            key={g}
                                            type="button"
                                            className={`gender-btn ${genere === g ? "active" : ""}`}
                                            onClick={() => setGenere(g)}
                                        >
                                            {g === "altre" ? "Altres" : g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="profile-fields-grid--4">
                                <div className="profile-field">
                                    <label>Alçada (cm)</label>
                                    <input name="alcada" type="text" placeholder="175"
                                        value={form.alcada} onChange={handleChange} />
                                </div>
                                <div className="profile-field">
                                    <label>Alçada espatlles (cm)</label>
                                    <input name="alcadaEspatlles" type="text" placeholder="145"
                                        value={form.alcadaEspatlles} onChange={handleChange} />
                                </div>
                                <div className="profile-field">
                                    <label>Envergadura (cm)</label>
                                    <input name="envergadura" type="text" placeholder="180"
                                        value={form.envergadura} onChange={handleChange} />
                                </div>
                                <div className="profile-field">
                                    <label>Pes (kg)</label>
                                    <input name="pes" type="text" placeholder="72"
                                        value={form.pes} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="profile-checks-row">
                                <label className="profile-check-label">
                                    <input type="checkbox" checked={canalla}
                                        onChange={e => setCanalla(e.target.checked)} />
                                    És canalla?
                                </label>
                                <label className="profile-check-label">
                                    <input type="checkbox" checked={lesionat}
                                        onChange={e => {
                                            setLesionat(e.target.checked);
                                            if (!e.target.checked)
                                                setForm(prev => ({ ...prev, dataLesio: "" }));
                                        }} />
                                    Estic lesionat/ada
                                </label>
                                <div className={`profile-field ${!lesionat ? "profile-field--disabled" : ""}`}>
                                    <label>Data de la lesió</label>
                                    <input name="dataLesio" type="date"
                                        value={form.dataLesio} onChange={handleChange}
                                        readOnly={!lesionat} />
                                </div>
                            </div>

                            <div className="profile-field profile-fields-grid--full">
                                <label>Informació extra</label>
                                <textarea name="infoExtra" rows={3}
                                    placeholder="Al·lèrgies, observacions mèdiques, etc."
                                    value={form.infoExtra} onChange={handleChange} />
                            </div>
                        </div>
                    </div>

                    <div className="profile-card">
                        <div className="profile-section-header">
                            <FaUsers />
                            <h2>Informació dins la colla actual</h2>
                        </div>

                        <div className="profile-colla-grid">
                            <div className="profile-field">
                                <label>Sobrenom</label>
                                <input name="mote" type="text" placeholder="Com et coneixen?" readOnly={!isTecnica}
                                    value={form.mote} onChange={handleChange} />

                            </div>

                            {isTecnica && (
                                <>
                                    <div className="profile-field">
                                        <label>Rol</label>
                                        <select value={selectedRole}
                                            onChange={e => setSelectedRole(e.target.value)}>
                                            <option value="">Selecciona rol</option>
                                            {existingRoles.map(r => (
                                                <option key={r.id} value={String(r.id)}>{r.nom}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="profile-field">
                                        <label>Posicions</label>
                                        <MultiSelectDropdown
                                            options={existingPositions}
                                            selected={selectedPositions}
                                            setSelected={setSelectedPositions}
                                            placeholder="Selecciona posicions"
                                        />
                                    </div>
                                    <div className="profile-field">
                                        <label>Grups</label>
                                        <MultiSelectDropdown
                                            options={existingGroups}
                                            selected={selectedGroups}
                                            setSelected={setSelectedGroups}
                                            placeholder="Selecciona grups"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="profile-actions">
                        {isTecnica ? (
                            <button className="btn-profile-delete" type="button"
                                onClick={deleteMemberFromColla}>
                                <FaUserAltSlash /> Eliminar usuari
                            </button>
                        ) : (
                            <button className="btn-profile-cancel" type="button"
                                onClick={() => alert("Funcionalitat encara no implementada.")}>
                                <FaPencilAlt /> Canviar contrasenya
                            </button>
                        )}

                        <div className="profile-actions-right">
                            <button className="btn-profile-cancel" type="button"
                                onClick={() => navigate(-1)}>
                                <FaTimesCircle /> Cancel·lar
                            </button>
                            <button className="btn-profile-save" type="button"
                                onClick={() => {
                                    modifyDataProfile();
                                    if (isTecnica) modifyDataMember();
                                }}>
                                <FaSave /> Guardar canvis
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default UserProfile;
