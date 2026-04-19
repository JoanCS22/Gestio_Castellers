import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt } from "react-icons/fa";

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Usuaris_PerfilNormal.css";

function NormalProfile() {
    const navigate = useNavigate();

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

    const [gender, setGender] = useState("M");
    const [lesionat, setLesionat] = useState(false);
    const [canalla, setCanalla] = useState(false);
    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);
    const [foto, setFoto] = useState("/prueba.jpg");
    
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
        e.preventDefault();

        const user = JSON.parse(localStorage.getItem("user"));
        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/getUserData", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (response.ok) {

            setForm(
                nom = data.nom,
                cognoms = data.cognoms,
                mote = data.mote,
                telefon = data.telefon,
                email = data.email,
                alcadaEspatlles = data.altura_espatlles,
                envergadura = data.envergadura,
                pes = data.pes,
                alcada = data.altura_total,
                dataLesio = data.data_lesio,
                infoExtra = data.comentari,
            )

            setLesionat(data.lesionat);
            setGender(data.genere);
            setCanalla(data.canalla);
        } else {
            setError(data.message);
        }
    }

    const updateData = async (e) => {
        e.preventDefault();

        const errors = comprovaNums();

        if (errors.length > 0) {
            setError(`Els següents camps han de ser numèrics i positius: ${errors.join(", ")}`);
            return;
        }

        showTempMessage("Iniciant sessió...");
    }

    useEffect(() => {
        getData();
    }, []);

    return (
        <div>
            <TopMenu title="Les meves dades" tornar />

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
                            navigate("/normal_profile");
                            alert("Funcionalitat encara no implementada.");
                        }}
                    />
                </div>

                <div className="grid-two">
                    <Input
                        name="nom"
                        type="text"
                        placeholder="Nom"
                        value={form.nom}
                        onChange={handleChange}
                        inputTitle="Nom"
                    />
                </div>

                <div className="grid-three">
                    <Input
                        name="cognoms"
                        type="text"
                        placeholder="Cognoms"
                        value={form.cognoms}
                        onChange={handleChange}
                        inputTitle="Cognoms"
                    />
                </div>

                <div className="grid-four">
                    <Input
                        name="mote"
                        type="text"
                        placeholder="Mote"
                        value={form.mote}
                        onChange={handleChange}
                        inputTitle="Mote"
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
                        <button className={`gender-btn ${gender === "M" ? "active" : ""}`} onClick={() => setGender("M")}>
                            M
                        </button>
                        <button className={`gender-btn ${gender === "F" ? "active" : ""}`} onClick={() => setGender("F")}>
                            F
                        </button>
                        <button className={`gender-btn ${gender === "Altre" ? "active" : ""}`} onClick={() => setGender("Altre")}>
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
                            navigate("/normal_profile");
                            alert("Funcionalitat encara no implementada.");
                        }}
                    />

                    <Button
                        text="Canviar contrasenya"
                        icon={<FaPencilAlt />}
                        action={() => {
                            navigate("/normal_profile");
                            alert("Funcionalitat encara no implementada.");
                        }}
                    />

                    <Button
                        text="Cancelar"
                        icon={<FaTimesCircle />}
                        action={() => navigate("/dashboard")}
                    />
                </div>

            </div>
        </div>
    );
}

export default NormalProfile;