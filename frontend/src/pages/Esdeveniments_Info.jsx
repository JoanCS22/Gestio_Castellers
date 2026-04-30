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
                    <Input
                        name="tipus"
                        type="text"
                        placeholder="Tipus"
                        value={tipus}
                        onChange={
                            (e) => setTipus(e.target.value)
                        }
                        inputTitle="Tipus"
                    />
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
                        type="time"
                        value={form.durada}
                        onChange={handleChange}
                        inputTitle="Durada"
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
                                action={() => { }}
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