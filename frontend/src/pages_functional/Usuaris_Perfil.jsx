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

import { FaSave, FaTimesCircle, FaPencilAlt, FaUserAltSlash } from "react-icons/fa";

import Input from "../components/Input.jsx";
import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";
import MultiSelectDropdown from "../components/MultiSelectDropdown.jsx";

import "./Usuaris_Perfil.css";

function UserProfile() {
    const navigate = useNavigate();

    const location = useLocation();

    const { currentColla, loadingColles } = useColla();

    const params = new URLSearchParams(location.search);

    const userId = params.get("userId");
    const collaId = params.get("collaId");

    const isTecnica = location.pathname === '/tecnica_profile';

    const [form, setForm] = useState({
        nom: "",
        cognoms: "",
        mote: "",
        telefon: "",
        email: "",
        alcadaEspatlles: "",
        envergadura: "",
        pes: "",
        alcada: "",
        dataLesio: "",
        infoExtra: ""
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

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const comprovaNums = () => {
        const {
            telefon,
            alcada,
            alcadaEspatlles,
            envergadura,
            pes
        } = form;
        const fields = [
            { name: "Telèfon", value: telefon },
            { name: "Alçada", value: alcada },
            { name: "Alçada espatlles", value: alcadaEspatlles },
            { name: "Envergadura", value: envergadura },
            { name: "Pes", value: pes }
        ];
        let nonNumericFields = [];
        for (let field of fields) {
            const value = String(field.value || "").trim();

            if (value !== "" && (isNaN(value) || Number(value) <= 0)) {
                nonNumericFields.push(field.name);
            }
        }
        return nonNumericFields;
    }

    const getDataProfile = async () => {
        try {
            const data = await getData(userId);
            setForm({
                nom: data.nom || "",
                cognoms: data.cognoms || "",
                mote: data.mote || "",
                telefon: data.telefon || "",
                email: data.email || "",
                alcadaEspatlles: data.altura_espatlles || "",
                envergadura: data.envergadura || "",
                pes: data.pes || "",
                alcada: data.altura_total || "",
                dataLesio: data.data_lesio || "",
                infoExtra: data.comentari || ""
            });

            setLesionat(data.lesionat || false);
            setGenere(data.genere || "altre");
            setCanalla(data.canalla || false);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const getDataMemberCall = async () => {
        try {
            const data = await getDataMember(currentColla.id, userId);
            const row = data[0] || {};

            setSelectedPositions((row.posicions_ids || []).map(String));
            setSelectedGroups(row.grups_ids || []);
            setSelectedRole(row.rol_id ? String(row.rol_id) : "");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadCollesPositions = async () => {
        try {
            const data = await getCollesPositions(currentColla.id);
            setExistingPositions(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadCollesGrups = async () => {
        try {
            const data = await getCollesGroups(currentColla.id);
            setExistingGroups(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadCollesRoles = async () => {
        try {
            const data = await getCollesRoles(currentColla.id);
            setExistingRoles(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const modifyDataProfile = async () => {
        const errors = comprovaNums();
        if (errors.length > 0) {
            setError(`Els següents camps han de ser numèrics i positius: ${errors.join(", ")}`);
            return;
        }
        let query;
        if (isTecnica) {
            query = `/profile/modifyUserData?userId=${userId}`;
        } else {
            query = `/profile/modifyUserData`;
        }
        try {
            const data = await updateData(userId, form, lesionat, genere, canalla, query);
            setError("");
            showTempMessage("Informació general de l'usuari actualitzada correctament.");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const modifyDataMember = async () => {
        let errors = [];
        if (!selectedRole) {
            errors.push("El camp de rol no pot estar buit.");
        }
        if (errors.length > 0) {
            setError(errors.join("\n"));
            return;
        }
        try {
            const data = await modifyMember(currentColla.id, userId, selectedRole, selectedPositions, selectedGroups);
            setError("");
            showTempMessage("Dades del membre actualitzades correctament.");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const deleteMemberFromColla = async () => {
        if (!window.confirm("Segur que vols eliminar a l'usuari de la colla?")) return;
        try {
            const data = await deleteMember(currentColla.id, userId);
            setError("");
            showTempMessage("Usuari eliminat correctament de la colla.");
            setTimeout(() => {
                navigate(`/members`);
            }, 2000);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

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
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}

            <div className="grid-container">

                <div className="grid-one">
                    <img src={foto} alt="perfil" />
                    <Button
                        text="Modificar foto"
                        icon={<FaPencilAlt />}
                        action={() => {
                            alert("Funcionalitat encara no implementada.");
                        }}
                    />
                </div>

                <div className="grid-two">
                    <Input
                        name="mote"
                        type="text"
                        placeholder="Sobrenom"
                        value={form.mote}
                        onChange={handleChange}
                        inputTitle="Sobrenom"
                    />
                </div>

                <div className="grid-three">
                    <Input
                        name="nom"
                        type="text"
                        placeholder="Nom"
                        value={form.nom}
                        onChange={handleChange}
                        inputTitle="Nom"
                    />
                </div>

                <div className="grid-four">
                    <Input
                        name="cognoms"
                        type="text"
                        placeholder="Cognoms"
                        value={form.cognoms}
                        onChange={handleChange}
                        inputTitle="Cognoms"
                    />
                </div>

                <div className="grid-five">
                    <Input
                        name="telefon"
                        type="text"
                        placeholder="Telèfon"
                        value={form.telefon}
                        onChange={handleChange}
                        inputTitle="Telèfon"
                    />
                </div>

                <div className="grid-six">
                    <Input
                        name="email"
                        type="text"
                        placeholder="Correu electrònic"
                        value={form.email}
                        onChange={handleChange}
                        inputTitle="Correu electrònic"
                        readOnly
                    />
                </div>

                <div className="grid-seven">
                    <div>Gènere</div>
                    <div className="gender-container">
                        <button className={`gender-btn ${genere === "M" ? "active" : ""}`} onClick={() => setGenere("M")}>
                            M
                        </button>
                        <button className={`gender-btn ${genere === "F" ? "active" : ""}`} onClick={() => setGenere("F")}>
                            F
                        </button>
                        <button className={`gender-btn ${genere === "altre" ? "active" : ""}`} onClick={() => setGenere("altre")}>
                            Altres
                        </button>
                    </div>
                </div>

                <div className="grid-eight">
                    <Input
                        name="alcada"
                        type="text"
                        placeholder="Alçada"
                        value={form.alcada}
                        onChange={handleChange}
                        inputTitle="Alçada (cm)"
                    />
                </div>

                <div className="grid-nine">
                    <Input
                        name="alcadaEspatlles"
                        type="text"
                        placeholder="Alçada espatlles"
                        value={form.alcadaEspatlles}
                        onChange={handleChange}
                        inputTitle="Alçada espatlles (cm)"
                    />
                </div>

                <div className="grid-ten">
                    <Input
                        name="envergadura"
                        type="text"
                        placeholder="Envergadura"
                        value={form.envergadura}
                        onChange={handleChange}
                        inputTitle="Envergadura (cm)"
                    />
                </div>

                <div className="grid-eleven">
                    <Input
                        name="pes"
                        type="text"
                        placeholder="Pes"
                        value={form.pes}
                        onChange={handleChange}
                        inputTitle="Pes (kg)"
                    />
                </div>

                <div className="grid-thirteen">
                    <div>Canalla</div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={canalla}
                            onChange={
                                (e) => setCanalla(e.target.checked)
                            }
                        />
                    </div>
                    <div>Lesionat</div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={lesionat}
                            onChange={
                                (e) => {
                                    const checked = e.target.checked;
                                    setLesionat(checked);

                                    if (!checked) {
                                        setForm((prev) => ({
                                            ...prev,
                                            dataLesio: ""
                                        }));
                                    }
                                }
                            }
                        />
                    </div>
                </div>

                <div className="grid-fourteen">
                    <Input
                        name="dataLesio"
                        type="date"
                        value={form.dataLesio}
                        onChange={handleChange}
                        inputTitle="Data lesió"
                        readOnly={!lesionat}
                    />
                </div>

                <div className="grid-fifteen">
                    <Input
                        name="infoExtra"
                        type="textarea"
                        inputTitle="Informació extra"
                        value={form.infoExtra}
                        onChange={handleChange}
                    />
                </div>

                {isTecnica && (
                    <>
                        <div className="grid-role-profile">
                            <label className="field-label-role">Rol</label>

                            <div className="select-wrapper-role">
                                <select
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="custom-select-role"
                                >
                                    <option value="">Selecciona rol</option>

                                    {existingRoles.map(r => (
                                        <option key={r.id} value={String(r.id)}>
                                            {r.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="grid-positions-profile">
                            Posicions:
                            <MultiSelectDropdown
                                options={existingPositions}
                                selected={selectedPositions}
                                setSelected={setSelectedPositions}
                                placeholder="Selecciona posicions"
                            />
                        </div>
                        <div className="grid-groups-profile">
                            Grups:
                            <MultiSelectDropdown
                                options={existingGroups}
                                selected={selectedGroups}
                                setSelected={setSelectedGroups}
                                placeholder="Selecciona grups"
                            />
                        </div>
                    </>
                )}
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <div className="flex-buttons">
                    <Button
                        text="Guardar canvis"
                        icon={<FaSave />}
                        action={() => {
                            modifyDataProfile();
                            if (isTecnica) {
                                modifyDataMember();
                            }
                        }}
                    />

                    {!isTecnica ? (
                        <>
                            <Button
                                text="Canviar contrasenya"
                                icon={<FaPencilAlt />}
                                action={() => {
                                    alert("Funcionalitat encara no implementada.");
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <Button
                                text="Eliminar usuari"
                                icon={<FaUserAltSlash />}
                                action={() => {
                                    deleteMemberFromColla();
                                }}
                            />
                        </>
                    )}

                    <Button
                        text="Cancelar"
                        icon={<FaTimesCircle />}
                        action={() => navigate(-1)}
                    />
                </div>

            </div>
        </div>
    );
}

export default UserProfile;