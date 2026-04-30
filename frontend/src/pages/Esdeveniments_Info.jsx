import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt, FaPlusSquare, FaSearch, FaRegEye } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Esdeveniments_Info.css";
import { act } from "react";

function EsdevenimentsInfo() {
    const navigate = useNavigate();

    const location = useLocation();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const isModify = location.pathname === "/modify_esdeveniment";
    const isConsult = location.pathname === "/consult_esdeveniment";
    const isCreate = location.pathname === "/create_esdeveniment";

    const [form, setForm] = useState({
        nom: "",
        data: "",
        hora: "",
        durada: "",
        adreca: "",
        link_adreca: "",
        info_extra: "",
        data_inscripcions: ""
    });

    const [visible, setVisible] = useState(false);
    const [acompanyat, setAcompanyat] = useState(false);
    const [bus, setBus] = useState(false);
    const [tipus, setTipus] = useState("Assaig");
    const [tipusAltres, setTipusAltres] = useState("");

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

    function generateCode(long = 6) {
        const caracs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';

        for (let i = 0; i < long; i++) {
            const randomIndex = Math.floor(Math.random() * caracs.length);
            result += caracs[randomIndex];
        }

        return result;
    }

    const createEsdeveniment = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const compulsoryInputs = {
            nom: "Nom",
            data: "Data",
            hora: "Hora",
            durada: "Durada",
            adreca: "Adreça",
            data_inscripcions: "Data Inscripcions"
        };

        for (const key in compulsoryInputs) {
            if (!form[key] || form[key].toString().trim() === "") {
                setError(`El camp ${compulsoryInputs[key]} és obligatori`);
                return;
            }
        }

        if (tipus === "Altres" && tipusAltres.trim() === "") {
            setError("Has d'especificar el tipus si selecciones 'Altres'");
            return;
        }

        const code = generateCode();
        console.log(code);

        const response = await fetch(`http://localhost:5000/esdeveniments/createEsdeveniment?id=${idColla}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: form.nom,
                tipus: tipus === "Altres" ? tipusAltres : tipus,
                data_esdeveniment: form.data,
                hora: form.hora,
                duracio: form.durada,
                adreca: form.adreca,
                link_adreca: form.link_adreca,
                visible: visible,
                acompanyat: acompanyat,
                bus: bus,
                data_inici_inscripcions: form.data_inscripcions,
                info_addicional: form.info_extra,
                codi_confirmacio: code
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Create colla OK");
            setError("");
            showTempMessage("Esdeveniment creat correctament.");
            navigate("/consult_esdeveniment")
        } else {
            console.log("{DEBUG} Create colla KO");
            setError(data.message);
        }
    }

    return (
        <div>
            <TopMenu
                title={`${isCreate ? "Crear esdeveniment" : `${form.nom}`}`} tornar
            />

            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}

            <div className="grid-container-esdeveniment-info">
                <div className="grid-container-esdeveniment-1">
                    <Input
                        name="nom"
                        type="text"
                        placeholder="Nom"
                        value={form.nom}
                        onChange={handleChange}
                        inputTitle="Nom"
                    />
                </div>
                <div className="grid-container-esdeveniment-2">
                    <div className="input-container-esdeveniment-info">
                        <label>Tipus</label>

                        <select
                            value={tipus}
                            onChange={(e) => setTipus(e.target.value)}
                            className="select-esdeveniment-info"
                        >
                            <option value="Assaig">Assaig</option>
                            <option value="Actuacio">Actuació</option>
                            <option value="Altres">Altres</option>
                        </select>

                        {tipus === "Altres" && (
                            <input
                                type="text"
                                placeholder="Especifica el tipus"
                                value={tipusAltres}
                                onChange={(e) => setTipusAltres(e.target.value)}
                                className="input-altres-info"
                            />
                        )}
                    </div>
                </div>
                <div className="grid-container-esdeveniment-7">
                    <div>Amb acompanyants?</div>
                    <div className="checkbox-container-esdeveniment-info">
                        <input
                            type="checkbox"
                            checked={acompanyat}
                            onChange={
                                (e) => setAcompanyat(e.target.checked)
                            }
                        />
                    </div>
                </div>
                <div className="grid-container-esdeveniment-4">
                    <Input
                        name="data"
                        type="date"
                        value={form.data}
                        onChange={handleChange}
                        inputTitle="Data"
                    />
                </div>
                <div className="grid-container-esdeveniment-5">
                    <Input
                        name="hora"
                        type="time"
                        value={form.hora}
                        onChange={handleChange}
                        inputTitle="Hora inici"
                    />
                </div>
                <div className="grid-container-esdeveniment-6">
                    <Input
                        name="durada"
                        type="text"
                        value={form.durada}
                        onChange={handleChange}
                        inputTitle="Durada (en minuts)"
                    />
                </div>
                <div className="grid-container-esdeveniment-8">
                    <div>Amb bus?</div>
                    <div className="checkbox-container-esdeveniment-info">
                        <input
                            type="checkbox"
                            checked={bus}
                            onChange={
                                (e) => setBus(e.target.checked)
                            }
                        />
                    </div>
                </div>
                <div className="grid-container-esdeveniment-9">
                    <Input
                        name="adreca"
                        type="text"
                        placeholder="Adreça"
                        value={form.adreca}
                        onChange={handleChange}
                        inputTitle="Adreça"
                    />
                </div>
                <div className="grid-container-esdeveniment-10">
                    <Input
                        name="link_adreca"
                        type="url"
                        placeholder="Link adreça"
                        value={form.link_adreca}
                        onChange={handleChange}
                        inputTitle="Link Adreça"
                    />
                </div>
                <div className="grid-container-esdeveniment-11">
                    <Input
                        name="info_extra"
                        type="textarea"
                        inputTitle="Informació extra"
                        value={form.info_extra}
                        onChange={handleChange}
                    />
                </div>
                <div className="grid-container-esdeveniment-12">
                    <Input
                        name="data_inscripcions"
                        type="date"
                        value={form.data_inscripcions}
                        onChange={handleChange}
                        inputTitle="Data inici inscripcions"
                    />
                </div>
                <div className="grid-container-esdeveniment-3">
                    <div>Visible?</div>
                    <div className="checkbox-container-esdeveniment-info">
                        <input
                            type="checkbox"
                            checked={visible}
                            onChange={
                                (e) => setVisible(e.target.checked)
                            }
                        />
                    </div>
                </div>

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <div className="grid-container-esdeveniment-info-buttons">
                    {isConsult && (
                        <>
                            <Button
                                text="Modificar esdeveniment"
                                icon={<FaPencilAlt />}
                                action={() => navigate("/modify_esdeveniment")}
                            />
                        </>
                    )}
                    {isModify && (
                        <>
                            <Button
                                text="Guardar canvis"
                                icon={<FaSave />}
                                action={() => {
                                    
                                }}
                            />
                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => navigate(-1)}
                            />
                        </>
                    )}
                    {isCreate && (
                        <>
                            <Button
                                text="Crear esdeveniment"
                                icon={<FaPlusSquare />}
                                action={createEsdeveniment}
                            />
                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => navigate(-1)}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EsdevenimentsInfo;