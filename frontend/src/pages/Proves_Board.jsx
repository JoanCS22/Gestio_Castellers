import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaCheck, FaCheckDouble, FaVideoSlash, FaVideo, FaTrashAlt, FaTimesCircle, FaCheckCircle,
    FaRegStar, FaHashtag, FaEye, FaEyeSlash
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

        console.log(data);

        if (response.ok) {
            setProvaInfo(data);
            console.log("{DEBUG} Get prova by id OK")
        } else {
            console.log("{DEBUG} Get prova by id KO")
            setError(data.message);
        }
    }

    const modifyInfoProva = async (idPlantilla, action, favoriteValue = false, fetaValue = false) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/modifyInfoProva?id=${idPlantilla}&action=${action}`, {
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
                            modifyInfoProva(provaInfo.id, "fet", false, !provaInfo?.feta);
                        }}>
                            {provaInfo?.feta ? (
                                <FaCheckCircle title="No realitzada?" className="icon-feta" />
                            ) : (
                                <FaTimesCircle title="Realitzada?" className="icon-no-feta" />
                            )}
                        </div>
                        <div className="icon-btn" onClick={() => {
                            modifyInfoProva(provaInfo.id, "favorite", !provaInfo.favorita);
                        }}>
                            <FaRegStar />
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
                            /* FER PÚBLICA PROVA */
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
                            <FaTrashAlt />
                        </div>
                    </>
                }
            />
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