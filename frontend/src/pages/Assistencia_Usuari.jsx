import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

import { FaCheckDouble, FaSave, FaCheck, FaTimes, FaQuestion, FaPaperPlane, FaTimesCircle } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import './Assistencia_Usuari.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";
import Input from "../components/Input";

const AssistenciaUsuari = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const id_usuari = localStorage.getItem("user").id;

    const params = new URLSearchParams(location.search);
    const id_esdeveniment = params.get("idEsdeveniment");

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const [currentEsdeveniment, setCurrentEsdeveniment] = useState({
        nom: "",
        data: "",
        hora: "",
        data_inscripcions: "",
        codi: "",
    });

    const [acompanyat, setAcompanyat] = useState(false);
    const [bus, setBus] = useState(false);
    const [tipus, setTipus] = useState("Assaig");

    const [currentAssistance, setCurrentAssistance] = useState({
        id: 0,
        comentari: "",
        num_acompanyants: 0,
        temps_tard: 0,
        temps_aviat: 0,
    });

    const [assistenciaSeleccionada, setAssistenciaSeleccionada] = useState(null);

    const [busAssistencia, setBusAssistencia] = useState(false);
    const [arribaTard, setArribaTard] = useState(false);
    const [marxaAviat, setMarxaAviat] = useState(false);

    const [showModal, setShowModal] = useState(false);
    const [modalText, setModalText] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setCurrentAssistance((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const getEsdevenimentInfo = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/esdeveniments/getEsdevenimentInfo?id=${id_esdeveniment}`, {
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
            setCurrentEsdeveniment({
                nom: data.nom,
                data: data.data_esdeveniment.split("T")[0],
                hora: data.hora,
                data_inscripcions: data.data_inici_inscripcions.split("T")[0],
                codi: data.codi_confirmacio,
                temps_tard: data.temps_tard,
                temps_aviat: data.temps_aviat,
            });

            setTipus(data.tipus);
            setAcompanyat(data.acompanyat);
            setBus(data.bus);

            console.log("{DEBUG} Get esdeveniments's data OK")
        } else {
            console.log("{DEBUG} Get esdeveniments's data KO")
            setError(data.message);
        }
    }

    const getAssistenciaActual = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/assistencia/getAssistenciaByMember?id=${id_esdeveniment}`, {
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
            setCurrentAssistance({
                id: data.id,
                comentari: data.comentari,
                num_acompanyants: data.num_acompanyants,
                temps_tard: data.temps_tard,
                temps_aviat: data.temps_aviat,
            });

            setAssistenciaSeleccionada(data.confirmacio_previa);
            setBusAssistencia(data.bus);
            setArribaTard(data.arriba_tard);
            setMarxaAviat(data.marxa_aviat);

            console.log("{DEBUG} Get esdeveniments's data OK")
        } else {
            console.log("{DEBUG} Get esdeveniments's data KO")
            setError(data.message);
        }
    }

    const modifyAssistenciaPrevia = async () => {

        const token = localStorage.getItem("token");

        if (assistenciaSeleccionada === "") {
            setError(`Has de seleccionar algun valor d'assistència`);
            return;
        }

        const response = await fetch(`http://localhost:5000/assistencia/modifyAssistenciaPrevia?id=${currentAssistance.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                confirmacio_previa: assistenciaSeleccionada,
                bus: busAssistencia,
                num_acompanyants: currentAssistance.num_acompanyants,
                arriba_tard: arribaTard,
                marxa_aviat: marxaAviat,
                comentari: currentAssistance.comentari,
                temps_tard: currentAssistance.temps_tard,
                temps_aviat: currentAssistance.temps_aviat
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify assistència prèvia OK");
            setError("");
            showTempMessage("Assistència modificada correctament.");
        } else {
            console.log("{DEBUG} Modify assistència prèvia KO");
            setError(data.message);
        }
    }

    const verifyCode = async () => {

        const token = localStorage.getItem("token");

        if (modalText !== currentEsdeveniment.codi) {
            setError(`Codi incorrecte`);
            return;
        }

        const response = await fetch(`http://localhost:5000/assistencia/confirmAssistencia?id=${currentAssistance.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                confirmacio_arribada: "si"
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify assistència arribada OK");
            setModalText("");
            setShowModal(false);
            setError("");
            showTempMessage("Assistència confirmada correctament.");
        } else {
            console.log("{DEBUG} Modify assistència arribada KO");
            setError(data.message);
        }
    }

    useEffect(() => {
        getEsdevenimentInfo();
        getAssistenciaActual();
    }, []);

    return (
        <div>
            <TopMenu
                title={`Assistència ${currentEsdeveniment.nom}`}
                tornar
            />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            <div className='grid-assistencia-usuari'>
                <div className='grid-assistencia-usuari-title'>
                    {tipus} el dia {new Date(currentEsdeveniment.data).toLocaleDateString("es-ES")} a les {currentEsdeveniment.hora}
                </div>
                <div className='grid-assistencia-usuari-first-row'>
                    <div className='grid-assistencia-usuari-first-row-buttons'>
                        <span>Assistència</span>
                        <div
                            className={`numbers-assistencia-usuari-element-ok 
                                ${assistenciaSeleccionada === "si" ? "active-assistencia" : ""}`}
                            onClick={() => setAssistenciaSeleccionada("si")}>
                            <FaCheck />
                        </div>
                        <div
                            className={`numbers-assistencia-usuari-element-ko 
                                ${assistenciaSeleccionada === "no" ? "active-assistencia" : ""}`}
                            onClick={() => setAssistenciaSeleccionada("no")}>
                            <FaTimes />
                        </div>

                        <div
                            className={`numbers-assistencia-usuari-element-unknown 
                                ${assistenciaSeleccionada === "no_sap" ? "active-assistencia" : ""}`}
                            onClick={() => setAssistenciaSeleccionada("no_sap")}>
                            <FaQuestion />
                        </div>
                    </div>
                    <div className='grid-assistencia-usuari-first-row-bus'>
                        {(bus && tipus !== "Assaig") && (
                            <>
                                <span>Vaig amb bus:</span>
                                <div className="checkbox-container-assistencia-info">
                                    <input
                                        type="checkbox"
                                        checked={busAssistencia}
                                        onChange={
                                            (e) => {
                                                setBusAssistencia(e.target.checked)
                                            }
                                        }
                                    />
                                </div>
                            </>
                        )}
                    </div>
                    <div className='grid-assistencia-usuari-first-row-companions'>
                        <span>Acompanyants: </span>
                        <Input
                            name="num_acompanyants"
                            type="number"
                            placeholder="Nombre d'acompanyants"
                            value={currentAssistance.num_acompanyants}
                            onChange={handleChange}
                            inputTitle="Acompanyants"
                        />
                    </div>
                </div>
                <div className='grid-assistencia-usuari-second-row'>
                    <div className='grid-assistencia-usuari-second-row-tard'>
                        {acompanyat && (
                            <>
                                <span>Arribo tard:</span>
                                <input
                                    type="checkbox"
                                    checked={arribaTard}
                                    onChange={
                                        (e) => {
                                            setArribaTard(e.target.checked)
                                        }
                                    }
                                />
                            </>
                        )}
                        {arribaTard && (
                            <>
                                <Input
                                    name="temps_tard"
                                    type="number"
                                    placeholder="Temps que arribaré tard..."
                                    value={currentAssistance.temps_tard}
                                    onChange={handleChange}
                                    inputTitle="Quant? (en minuts)"
                                />
                            </>
                        )}
                    </div>
                    <div className='grid-assistencia-usuari-second-row-aviat'>
                        <span>Marxo d'hora:</span>
                        <input
                            type="checkbox"
                            checked={marxaAviat}
                            onChange={
                                (e) => {
                                    setMarxaAviat(e.target.checked)
                                }
                            }
                        />
                        {marxaAviat && (
                            <>
                                <Input
                                    name="temps_aviat"
                                    type="number"
                                    placeholder="Temps que marxaré aviat..."
                                    value={currentAssistance.temps_aviat}
                                    onChange={handleChange}
                                    inputTitle="Quant? (en minuts)"
                                />
                            </>
                        )}
                    </div>
                </div>
                <div className='grid-assistencia-usuari-third-row'>
                    <Input
                        name="comentari"
                        type="textarea"
                        inputTitle="Comentari"
                        value={currentAssistance.comentari}
                        onChange={handleChange}
                    />
                </div>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}
                <div className='grid-assistencia-usuari-buttons'>
                    <Button
                        text="Guardar assistència"
                        icon={<FaSave />}
                        action={modifyAssistenciaPrevia}
                    />
                    <Button
                        text="Confirmació in situ"
                        icon={<FaCheckDouble />}
                        action={() => {
                            setShowModal(true);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AssistenciaUsuari;