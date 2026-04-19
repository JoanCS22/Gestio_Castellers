import { useState } from "react";
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

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div>
            <TopMenu title="Les meves dades" tornar />

            <div className="grid-container">

                <div className="grid-one">
                    <img src="" alt="perfil" />
                    <Button
                        text="Modificar foto"
                        icon={<FaPencilAlt />}
                        action={() => {}}
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
                    />
                </div>

                <div className="grid-seven">
                    <div className="input-title">Gènere</div>
                    <div className="gender-container">
                        <button className={`gender-btn ${gender === "M" ? "active" : ""}`} onClick={() => setGender("M")}>
                            M
                        </button>
                        <button className={`gender-btn ${gender === "F" ? "active" : ""}`} onClick={() => setGender("F")}>
                            F
                        </button>
                        <button className={`gender-btn ${gender === "Altres" ? "active" : ""}`} onClick={() => setGender("Altres")}>
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
                    <div>Lesionat</div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={lesionat}
                            onChange={(e) => setLesionat(e.target.checked)}
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

                <div className="flex-buttons">
                    <Button
                        text="Guardar canvis"
                        icon={<FaSave />}
                        action={() => console.log(form)}
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
                        action={() => navigate(-1)}
                    />
                </div>

            </div>
        </div>
    );
}

export default NormalProfile;