import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaCheck, FaCheckDouble, FaVideoSlash, FaVideo, FaTrashAlt, FaTimesCircle, FaCheckCircle,
    FaRegStar, FaHashtag, FaEye, FaEyeSlash, FaPencilAlt
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import "./Proves_Board.css"

import TopMenu from "../components/TopMenu.jsx";

import { useSyncExternalStore } from "react";

function ProvesBoard() {
    const navigate = useNavigate();

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const idProva = params.get("id");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [provaInfo, setProvaInfo] = useState(null)

    const [members, setMembers] = useState([]);

    const [searchResults, setSearchResults] = useState([]);

    const [showCastell, setShowCastell] = useState(false);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const getCollaMembers = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/members/getMembers?id=${idColla}`, {
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
            setMembers(data);
            console.log("{DEBUG} Get colla's members OK")
        } else {
            console.log("{DEBUG} Get colla's members KO")
            setError(data.message);
        }
    }

    const getProvaById = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/getProvaById?id=${idProva}`, {
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
            setProvaInfo(data);
            console.log("{DEBUG} Get prova by id OK")
        } else {
            console.log("{DEBUG} Get prova by id KO")
            setError(data.message);
        }
    }

    const updateFavorite = async (idPlantilla, favoriteValue) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/updateFavorite?id=${idPlantilla}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                favorita: favoriteValue,
                id: idPlantilla,
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify prova's favorite OK");

            await getProvaById();

            showTempMessage("Prova modificada.");
        } else {
            console.log("{DEBUG} Modify prova's favorite KO");
            setError(data.message);
        }
    }

    const updateFeta = async (idPlantilla, fetaValue) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/updateFeta`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                feta: fetaValue,
                id: idPlantilla,
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify prova's feta OK");

            await getProvaById();

            showTempMessage("Prova modificada.");
        } else {
            console.log("{DEBUG} Modify prova's feta KO");
            setError(data.message);
        }
    }

    const publishProva = async (idPlantilla, publicValue) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/publishProva`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                public: publicValue,
                id: idPlantilla,
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify prova's public OK");

            await getProvaById();

            showTempMessage("Prova modificada.");
        } else {
            console.log("{DEBUG} Modify prova's public KO");
            setError(data.message);
        }
    }

    const modifyInfoProva = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/modifyInfoProva?id=${provaInfo.id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                favorita: favoriteValue,
                feta: fetaValue
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify prova OK");

            await getProvaById();

            showTempMessage("Prova modificada.");
        } else {
            console.log("{DEBUG} Modify prova KO");
            setError(data.message);
        }
    }

    const deleteProva = async (id_prova) => {

        if (!window.confirm("Segur que vols eliminar aquesta prova?")) return;

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/deleteProva?id=${id_prova}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Delete prova OK");
            setError("");
            showTempMessage("Prova eliminada correctament.");
            getCollesPositions();
        } else {
            console.log("{DEBUG} Delete prova KO");
            setError(data.message);
        }
    }

    useEffect(() => {
        getCollaMembers();
        getProvaById();
    }, []);

    return (
        <div>
            <TopMenu
                title={provaInfo ? `${provaInfo.nom} - ${provaInfo.estructura}` : "Carregant prova..."}
                tornar
                leftIcons={
                    <>
                        {provaInfo?.xarxa && (
                            <div className="icon-btn">
                                <FaHashtag />
                            </div>
                        )}
                        <div className="icon-btn" onClick={() => {
                            updateFeta(provaInfo.id, !provaInfo?.feta);
                        }}>
                            {provaInfo?.feta ? (
                                <FaCheckCircle title="No realitzada?" className="icon-feta" />
                            ) : (
                                <FaTimesCircle title="Realitzada?" className="icon-no-feta" />
                            )}
                        </div>
                        <div className="icon-btn" onClick={() => {
                            updateFavorite(provaInfo.id, !provaInfo.favorita);
                        }}>
                            <FaRegStar title={provaInfo?.favorita ? "Treure de favorits" : "Afegir a favorits"} className={`icon-favorit ${provaInfo?.favorita ? "favorit-actiu" : ""}`} />
                        </div>
                    </>
                }

                rightIcons={
                    <>
                        <div className="icon-btn" onClick={() => { setShowCastell(!showCastell) }}>
                            {showCastell ? (
                                <FaVideoSlash />
                            ) : (
                                <FaVideo />
                            )}
                        </div>
                        <div className="icon-btn" onClick={() => {
                            publishProva(provaInfo.id, !provaInfo.public);
                        }}>
                            {provaInfo?.public ? (
                                <FaEye />
                            ) : (
                                <FaEyeSlash />
                            )}
                        </div>
                        <div className="icon-btn" onClick={() => {
                            /* DELETE PROVA */
                        }}>
                            <FaPencilAlt />
                        </div>
                    </>
                }
            />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            <div className="top-bar-prova-board">
                <div className="top-bar-prova-board-filters">
                    <div className="top-bar-prova-board-filters-search">

                    </div>
                    <div className="top-bar-prova-board-filters-checkboxrow-1">

                    </div>
                    <div className="top-bar-prova-board-filters-checkboxrow-2">

                    </div>
                </div>
                <div className="top-bar-prova-board-members">

                </div>
            </div>
            <div className="left-part-prova-board">

            </div>
            <div className="whole-board-prova">

            </div>
        </div>
    )
}

export default ProvesBoard;