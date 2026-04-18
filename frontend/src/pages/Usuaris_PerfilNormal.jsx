import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt } from "react-icons/fa";

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Usuaris_PerfilNormal.css";

function NormalProfile() {
    const navigate = useNavigate();

    const [gender, setGender] = useState("M");
    const [lesionat, setLesionat] = useState(false);
    const [dataLesio, setDataLesio] = useState("");

    return (
        <div>
            <TopMenu
                title="Les meves dades"
                tornar
            />
            <div className="grid-container">
                <div className="grid-one">
                    <Input
                        type="text"
                        placeholder="Foto de perfil"
                        value={""}
                        onChange={''}
                        inputTitle="ULR foto"
                    />
                </div>
                <div className="grid-two">
                    <Input
                        type="text"
                        placeholder="Nom"
                        value={""}
                        onChange={''}
                        inputTitle="Nom"
                    />
                </div>
                <div className="grid-three">
                    <Input
                        type="text"
                        placeholder="Cognoms"
                        value={""}
                        onChange={''}
                        inputTitle="Cognoms"
                    />
                </div>
                <div className="grid-four">
                    <Input
                        type="text"
                        placeholder="Mote"
                        value={""}
                        onChange={''}
                        inputTitle="Mote"
                    />
                </div>
                <div className="grid-five">
                    <Input
                        type="text"
                        placeholder="Telèfon"
                        value={""}
                        onChange={''}
                        inputTitle="Telèfon"
                    />
                </div>
                <div className="grid-six">
                    <Input
                        type="text"
                        placeholder="Correu electrònic"
                        value={""}
                        onChange={''}
                        inputTitle="Correu electrònic"
                    />
                </div>
                <div className="grid-seven">
                    <div className="input-title">Gènere</div>
                    <div className="gender-container">
                        <button
                            className={`gender-btn ${gender === "M" ? "active" : ""}`}
                            onClick={() => setGender("M")}
                        >
                            M
                        </button>
                        <button
                            className={`gender-btn ${gender === "F" ? "active" : ""}`}
                            onClick={() => setGender("F")}
                        >
                            F
                        </button>
                        <button
                            className={`gender-btn ${gender === "Altres" ? "active" : ""}`}
                            onClick={() => setGender("Altres")}
                        >
                            Altres
                        </button>
                    </div>
                </div>
                <div className="grid-eight">
                    <Input
                        type="text"
                        placeholder="Alçada"
                        value={""}
                        onChange={''}
                        inputTitle="Alçada"
                    />
                </div>
                <div className="grid-nine">
                    <Input
                        type="text"
                        placeholder="Alçada espatlles"
                        value={""}
                        onChange={''}
                        inputTitle="Alçada espatlles"
                    />
                </div>
                <div className="grid-ten">
                    <Input
                        type="text"
                        placeholder="Alçada espatlles"
                        value={""}
                        onChange={''}
                        inputTitle="Alçada espatlles"
                    />
                </div>
                <div className="grid-eleven">
                    <Input
                        type="text"
                        placeholder="Envergadura"
                        value={""}
                        onChange={''}
                        inputTitle="Envergadura"
                    />
                </div>
                <div className="grid-twelve">
                    <Input
                        type="text"
                        placeholder="Pes"
                        value={""}
                        onChange={''}
                        inputTitle="Pes"
                    />
                </div>
                <div className="grid-thirteen">
                    <div className="input-title">Lesionat</div>
                    <div className="checkbox-container">
                        <input
                            type="checkbox"
                            checked={lesionat}
                            onChange={(e) => setLesionat(e.target.checked)}
                        />
                        <span>Sí</span>
                    </div>
                </div>
                <div className="grid-fourteen">
                    <Input
                        type="text"
                        placeholder="Data lesió"
                        value={""}
                        onChange={''}
                        inputTitle="Data lesió"
                    />
                </div>
                <div className="grid-fifteen">
                    <Input
                        type="text"
                        placeholder="Informació extra"
                        value={""}
                        onChange={''}
                        inputTitle="Informació extra"
                    />
                </div>
                <div className="flex-buttons">
                    <Button
                        text="Guardar canvis"
                        icon=<FaSave />
                        action
                    />
                    <Button
                        text="Canviar contrasenya"
                        icon=<FaPencilAlt />
                        action={() => { navigate("/normal_profile"); alert("Funcionalitat encara no implementada.") }}
                    />
                    <Button
                        text="Cancelar"
                        icon=<FaTimesCircle />
                        action={() => navigate(-1)}
                    />
                </div>
            </div>
        </div>
    );
}

export default NormalProfile; 