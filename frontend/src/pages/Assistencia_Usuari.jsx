import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

import { FaCheckDouble, FaSave, FaCheck, FaTimes, FaQuestion } from "react-icons/fa";

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
        comentari: "",
        num_acompanyants: 0
    });

    const [assistenciaPrevia, setAssistenciaPrevia] = useState("si");
    const [busAssistencia, setBusAssistencia] = useState(false);
    const [arribaTard, setArribaTard] = useState(false);
    const [marxaAviat, setMarxaAviat] = useState(false);


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

    useEffect(() => {
        getEsdevenimentInfo();
    }, []);

    return (
        <div>
            <TopMenu
                title={`Assistència ${currentEsdeveniment.nom}`}
            />
            <div className='grid-assistencia-usuari'>
                <div className='grid-assistencia-usuari-title'>
                    {tipus} el dia {new Date(currentEsdeveniment.data).toLocaleDateString("es-ES")} a les {currentEsdeveniment.hora}
                </div>
                <div className='grid-assistencia-usuari-first-row'>
                    <div className='grid-assistencia-usuari-first-row-buttons'>
                        <span>Assistència</span>
                        <div className="numbers-assistencia-usuari-element">
                            <FaCheck />
                        </div>
                        <div className="numbers-assistencia-usuari-element">
                            <FaTimes />
                        </div>
                        <div className="numbers-assistencia-usuari-element">
                            <FaQuestion />
                        </div>
                    </div>
                    <div className='grid-assistencia-usuari-first-row-bus'>
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
                    </div>
                    <div className='grid-assistencia-usuari-first-row-companions'>
                        <span>Acompanyants: </span>
                        <input
                            type="number"
                            value={currentAssistance.num_acompanyants}
                        />
                    </div>
                </div>
                <div className='grid-assistencia-usuari-second-row'>
                    <div className='grid-assistencia-usuari-second-row-tard'>
                        <div className='grid-assistencia-usuari-second-row-check'>
                            <span>Arribo tard:</span>
                            <div className="checkbox-container-assistencia-info">
                                <input
                                    type="checkbox"
                                    checked={arribaTard}
                                    onChange={
                                        (e) => {
                                            setArribaTard(e.target.checked)
                                        }
                                    }
                                />
                            </div>
                        </div>
                        <div className='grid-assistencia-usuari-second-row-input'>

                        </div>
                    </div>
                    <div className='grid-assistencia-usuari-second-row-aviat'>
                        <div className='grid-assistencia-usuari-second-row-check'>
                            <span>Marxo d'hora:</span>
                            <div className="checkbox-container-assistencia-info">
                                <input
                                    type="checkbox"
                                    checked={marxaAviat}
                                    onChange={
                                        (e) => {
                                            setMarxaAviat(e.target.checked)
                                        }
                                    }
                                />
                            </div>
                        </div>
                        <div className='grid-assistencia-usuari-second-row-input'>

                        </div>
                    </div>
                </div>
                <div className='grid-assistencia-usuari-third-row'>
                    <Input
                        name="comentari"
                        type="textarea"
                        inputTitle="Comentari"
                        value={currentAssistance.comentari}
                        onChange={() => { }}
                    />
                </div>
                <div className='grid-assistencia-usuari-buttons'>
                    <Button
                        text="Guardar assistència"
                        icon={<FaSave />}
                        action={() => { }}
                    />
                    <Button
                        text="Confirmació in situ"
                        icon={<FaCheckDouble />}
                        action={() => { }}
                    />
                </div>
            </div>
        </div>
    )
}

export default AssistenciaUsuari;