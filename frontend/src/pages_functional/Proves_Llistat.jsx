import {
    getProvesByEsdeveniment, saveOrder
} from "../services/provesService.js";
import { handleApiError } from "../utils/handleApiError.js";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaPlusSquare, FaClipboardList, FaSearch, FaTimesCircle, FaCheckCircle, FaHashtag,
    FaStar, FaPencilAlt, FaTimes, FaChevronUp, FaChevronDown
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import { useColla } from "../context/CollaContext.jsx";

import "./Proves_Llistat.css"

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";

import { useSyncExternalStore } from "react";

function ProvesLlistat() {
    const navigate = useNavigate();

    const location = useLocation();

    const { currentColla, loadingColles } = useColla();

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

    const [originalProves, setOriginalProves] = useState([]);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const moveProva = (id, direction) => {
        const updated = [...proves];

        const index = updated.findIndex(p => p.id === id);

        if (direction === "up" && index > 0) {
            [updated[index - 1], updated[index]] =
                [updated[index], updated[index - 1]];
        }

        if (direction === "down" && index < updated.length - 1) {
            [updated[index + 1], updated[index]] =
                [updated[index], updated[index + 1]];
        }

        const reordered = updated.map((p, i) => ({
            ...p,
            ordre: i + 1
        }));

        setProves(reordered);
    };

    const loadProvesByEsdeveniment = async () => {
        try {
            const data = await getProvesByEsdeveniment(idEsdeveniment);
            setProves(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const saveOrderCall = async () => {
        try {
            const data = await getProvesByEsdeveniment(idEsdeveniment);
            showTempMessage("Ordre guardat");
            setEditMode(false);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        loadProvesByEsdeveniment();
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
                                setOriginalProves([...proves]);
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
                                    saveOrderCall();
                                    setEditMode(false);
                                }}
                            />
                            <Button
                                text='Cancelar'
                                icon={<FaTimesCircle />}
                                action={() => {
                                    setProves(originalProves);
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
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "45%" }} />
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
                        {proves.map((prova, index) => (
                            <>
                                {(prova.public || hasWritePermission("proves")) && (
                                    <>
                                        <tr key={prova.id}>
                                            <td>
                                                {editMode ? (
                                                    <div className="ordre-controls">
                                                        <button
                                                            onClick={() => moveProva(prova.id, "up")}
                                                            disabled={index === 0}
                                                        >
                                                            <FaChevronUp />
                                                        </button>
                                                        <button
                                                            onClick={() => moveProva(prova.id, "down")}
                                                            disabled={index === proves.length - 1}
                                                        >
                                                            <FaChevronDown />
                                                        </button>
                                                    </div>
                                                ) : (
                                                    prova.ordre
                                                )}
                                            </td>
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