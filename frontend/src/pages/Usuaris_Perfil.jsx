import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt, FaUserAltSlash } from "react-icons/fa";

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import Button from "../components/Button";
import MultiSelectDropdown from "../components/MultiSelectDropdown";

import "./Usuaris_Perfil.css";

function UserProfile() {
    const navigate = useNavigate();

    const location = useLocation();

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
            const value = field.value.trim();

            if (value !== "" && (isNaN(value) || Number(value) <= 0)) {
                nonNumericFields.push(field.name);
            }
        }
        return nonNumericFields;
    }

    const getData = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/profile/getUserData?userId=${userId}`, {
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

            console.log("{DEBUG} Get user's data OK")
        } else {
            console.log("{DEBUG} Get user's data KO")
            setError(data.message);
        }
    }

    const getDataMember = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/members/getDataMember?userid=${userId}&collaid=${idColla}`, {
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

            const row = data[0] || {};

            setSelectedPositions((row.posicions_ids || []).map(String));
            setSelectedGroups((row.grups_ids || []).map(String));
            setSelectedRole(row.rol_id ? String(row.rol_id) : "");

            console.log("{DEBUG} Get member's data OK")
        } else {
            console.log("{DEBUG} Get member's data KO")
            setError(data.message);
        }
    }

    const getCollesPositions = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/colla/getCollaPositions?id=${idColla}`, {
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
            setExistingPositions(data);
            console.log("{DEBUG} Get colla's positions OK")
        } else {
            console.log("{DEBUG} Get colla's positions KO")
            setError(data.message);
        }
    }

    const getCollesRoles = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/colla/getCollaRoles?id=${idColla}`, {
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
            setExistingRoles(data);
            console.log("{DEBUG} Get colla's roles OK")
        } else {
            console.log("{DEBUG} Get colla's roles KO")
            setError(data.message);
        }
    }

    const updateData = async () => {

        const token = localStorage.getItem("token");
        const errors = comprovaNums();

        if (errors.length > 0) {
            setError(`Els següents camps han de ser numèrics i positius: ${errors.join(", ")}`);
            return;
        }

        const response = await fetch(`http://localhost:5000/profile/modifyUserData?userId=${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: form.nom,
                cognoms: form.cognoms,
                mote: form.mote,
                telefon: form.telefon,
                altura_espatlles: form.alcadaEspatlles || null,
                envergadura: form.envergadura || null,
                pes: form.pes || null,
                altura_total: form.alcada || null,
                data_lesio: form.dataLesio || null,
                comentari: form.infoExtra,
                lesionat: lesionat,
                genere: genere,
                canalla: canalla
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify user's data OK");
            setError("");
            showTempMessage("Informació actualitzada correctament.");
        } else {
            console.log("{DEBUG} Modify user's data KO");
            setError(data.message);
        }
    }

    const modifyMember = async () => {

        const token = localStorage.getItem("token");

        let errors = [];

        if (!selectedRole) {
            errors.push("El camp de rol no pot estar buit.");
        }

        if (errors.length > 0) {
            setError(errors.join("\n"));
            return;
        }

        const response = await fetch(`http://localhost:5000/members/modifyMember?collaid=${collaId}&userid=${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                id_rol: selectedRole,
                ids_posicions: selectedPositions
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
            showTempMessage("Dades del membre actualitzades correctament.");
            console.log("{DEBUG} Modify member OK")
        } else {
            console.log("{DEBUG} Modify member KO")
            setError(data.message);
        }
    }

    const deleteMemberFromColla = async () => {

        const token = localStorage.getItem("token");

        if (!window.confirm("Segur que vols eliminar a l'usuari de la colla?")) return;

        const response = await fetch(`http://localhost:5000/members/deleteMember?id=${collaId}&userid=${userId}`, {
            method: "DELETE",
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
            setError("");
            showTempMessage("Usuari eliminat correctament de la colla.");
            setTimeout(() => {
                navigate(`/members`);
            }, 2000);
            console.log("{DEBUG} Delete user from colla OK")
        } else {
            console.log("{DEBUG} Delete user from colla KO")
            setError(data.message);
        }
    }

    useEffect(() => {
        getData();
        if (isTecnica) {
            getDataMember();
            getCollesRoles();
            getCollesPositions();
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
                            updateData();
                            if (isTecnica) {
                                modifyMember();
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