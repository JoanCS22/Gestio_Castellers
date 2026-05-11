import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaPlusSquare, FaClipboardList, FaSearch, FaTimesCircle, FaCheckCircle, FaHashtag,
    FaRegStar, FaPencilAlt,
    FaTimes
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import "./Proves_Llistat.css"

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";

import { useSyncExternalStore } from "react";

function ProvesLlistat() {
    const navigate = useNavigate();

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const idEsdeveniment = params.get("idEsdeveniment");
    const nomEsdeveniment = params.get("nomEsdeveniment");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasAccess = (key) => permissions[key] !== "X";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [proves, setProves] = useState([]);

    const [editMode, setEditMode] = useState(false);

    const [newOrder, setNewOrder] = useState({});
    const [maxNumber, setMaxNumber] = useState(1);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const getProvesByEsdeveniment = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/getProvesByEsdeveniment?id=${idEsdeveniment}`, {
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
            setProves(data);
            setMaxNumber(Math.max(...data.map(prova => prova.ordre), 0));
            console.log("{DEBUG} Get esdeveniments's proves OK")
        } else {
            console.log("{DEBUG} Get esdeveniments's proves KO")
            setError(data.message);
        }
    }

    const modifyInfoProva = async (idPlantilla, action, newIndividualOrder) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/modifyInfoProva?id=${idPlantilla}&action=${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                ordre: newIndividualOrder
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify order OK");

            await getProvesByEsdeveniment();

            showTempMessage("Ordre de proves modificat.");
        } else {
            console.log("{DEBUG} Modify order KO");
            setError(data.message);
        }
    }

    useEffect(() => {
        getProvesByEsdeveniment();
    }, []);

    return (
        <div>
            <TopMenu
                title={`Proves ${nomEsdeveniment}`}
                tornar
            />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            <div className="button-section-proves">
                <>
                    {(hasWritePermission("proves") && !editMode) && (
                        <Button
                            text='Canviar ordre proves'
                            icon={<FaPencilAlt />}
                            action={() => {
                                setEditMode(true);
                            }}
                        />
                    )}
                    {editMode && (
                        <>
                            <Button
                                text='Guardar ordre'
                                icon={<FaPencilAlt />}
                                action={() => {
                                    modifyInfoProva(prova.id, "ordre", false, false);
                                    setEditMode(false);
                                }}
                            />
                            <Button
                                text='Cancelar'
                                icon={<FaTimesCircle />}
                                action={() => {
                                    setEditMode(false);
                                }}
                            />
                        </>
                    )}
                </>
            </div>
            {error && (
                <div className="error-message">
                    {error}
                </div>
            )}
            <div className="table-llistat-proves">
                <table>
                    <colgroup>
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "35%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "10%" }} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Ordre</th>
                            <th>Nom</th>
                            <th>Estructura</th>
                            <th>Comentari</th>
                            <th>Realitzada ja?</th>
                            <th>Amb xarxa?</th>
                        </tr>
                    </thead>
                    <tbody>
                        {proves.map((prova) => (
                            <>
                                {(prova.public || hasWritePermission("proves")) && (
                                    <>
                                        <tr key={prova.id}>
                                            <td>{prova.ordre}</td>
                                            <td>{prova.nom}</td>
                                            <td>{prova.estructura}</td>
                                            <td>{prova.comentari}</td>
                                            <td>{prova.feta ? (
                                                <>
                                                    <FaCheckCircle className="icon-feta" />
                                                </>
                                            ) : (
                                                <>
                                                    <FaTimesCircle className="icon-no-feta" />
                                                </>
                                            )}</td>
                                            <td>{prova.xarxa && (
                                                <FaHashtag className="icon-xarxa" />
                                            )}</td>
                                        </tr >
                                    </>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ProvesLlistat;