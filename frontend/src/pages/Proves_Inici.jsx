import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaPlusSquare, FaClipboardList, FaSearch, FaTimesCircle, FaCheckCircle, FaHashtag
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import "./Proves_Inici.css"

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";
import { useSyncExternalStore } from "react";

function ProvesInici() {

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

    const [estructures, setEstructures] = useState([]);
    const [selectedEstructures, setSelectedEstructures] = useState([]);
    const [openEstructures, setOpenEstructures] = useState(false);

    const [showModalAddProva, setShowModalAddProva] = useState(false);
    const [modalTags, setModalTags] = useState({
        nom: "",
        comentari: "",
        estructura: "",
        plantilla: "",
        xarxa: false,
        public: false
    });
    const [idSelectedPlantilla, setIdSelectedPlantilla] = useState(null);
    const [selectedPlantilla, setSelectedPlantilla] = useState(null);
    const [selectedModalStructure, setSelectedModalStructure] = useState(null);

    const [searchResults, setSearchResults] = useState([]);

    const [plantilles, setPlantilles] = useState([]);
    const [proves, setProves] = useState([]);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const handleStructureChange = (value) => {
        setSelectedEstructures(prev =>
            prev.includes(value)
                ? prev.filter(v => v !== value)
                : [...prev, value]
        );
    };

    const getCollesStructures = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/plantilles/getEstructuresByColla?id=${idColla}`, {
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
            setEstructures(data);
            console.log("{DEBUG} Get colla's structures OK")
        } else {
            console.log("{DEBUG} Get colla's structures KO")
            setError(data.message);
        }
    }

    const getCollesPlantilles = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/plantilles/getPlantillesByColla?id=${idColla}`, {
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
            setPlantilles(data);
            console.log("{DEBUG} Get colla's plantilles OK")
        } else {
            console.log("{DEBUG} Get colla's plantilles KO")
            setError(data.message);
        }
    }

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
            console.log("{DEBUG} Get esdeveniments's proves OK")
        } else {
            console.log("{DEBUG} Get esdeveniments's proves KO")
            setError(data.message);
        }
    }

    const createProva = async () => {

        const token = localStorage.getItem("token");

        const compulsoryInputs = {
            nom: "Nom",
            estructura: "Estructura",
            plantilla: "Plantilla"
        };

        for (const key in compulsoryInputs) {
            if (!modalTags[key] || modalTags[key].toString().trim() === "") {
                setError(`El camp ${compulsoryInputs[key]} és obligatori`);
                return;
            }
        }

        const response = await fetch(`http://localhost:5000/proves/createProva?id=${idEsdeveniment}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: modalTags.nom,
                comentari: modalTags.comentari,
                estructura: modalTags.estructura,
                public: modalTags.public,
                xarxa: modalTags.xarxa,
                estructura: modalTags.estructura,
                id_plantilla: idSelectedPlantilla
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Create prova OK");

            await getProvesByEsdeveniment();

            resetModal();
            showTempMessage("Prova creada correctament.");
        } else {
            console.log("{DEBUG} Create prova KO");
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

            await getProvesByEsdeveniment();

            showTempMessage("Prova modificada.");
        } else {
            console.log("{DEBUG} Modify prova KO");
            setError(data.message);
        }
    }

    useEffect(() => {
        getCollesStructures();
        getProvesByEsdeveniment();
        getCollesPlantilles();
    }, []);

    return (
        <div>
            <TopMenu
                title={`Proves ${nomEsdeveniment}`}
            />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            <div className="button-section-proves">
                <>
                    {hasWritePermission("proves") && (
                        <Button
                            text='Afegir prova'
                            icon={<FaPlusSquare />}
                            action={() => {
                                setShowModalAddProva(true);
                            }}
                        />
                    )}
                    {hasAccess("proves") && (
                        <Button
                            text='Llistat de proves'
                            icon={<FaClipboardList />}
                            action={() => {
                                setShowModalAddProva(false);
                            }}
                        />
                    )}
                </>
            </div>
            <div className="filtres-plantilles">
                <div className="search-tab-plantilles">
                    <span>Cercar:</span>
                    <FaSearch />
                    <input type='search' placeholder='Cercar...'></input>
                </div>
                <div className="dropdown-estructures-plantilles">
                    <span>Estructures:</span>
                    <button onClick={() => setOpenEstructures(!openEstructures)}>
                        Seleccionats ({selectedEstructures.length}) ▾
                    </button>
                    {openEstructures && (
                        <div className="dropdown-content-estructures-plantilles">
                            {estructures.map((item) => (
                                <label key={item.estructura}>
                                    <input
                                        type="checkbox"
                                        checked={selectedEstructures.includes(item.estructura)}
                                        onChange={() => handleStructureChange(item.estructura)}
                                    />
                                    {item.estructura}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="grid-proves-list">
                {proves.map((prova) => (
                    <div className="container-proves">
                        <div className="container-proves-text" onClick={() => {
                            //navigate(`/plantilla_crear?id=${prova.id}`)
                        }}>
                            <span>{prova.nom}</span>
                            <span>{prova.estructura}</span>
                        </div>
                        <div className="container-proves-icons">
                            {prova.xarxa && (
                                <>
                                    <FaHashtag className="icon-xarxa" title="Xarxa"/>
                                </>
                            )}
                            {prova.feta ? (
                                <>
                                    <FaCheckCircle title="Indicar que no s'ha fet" className="icon-feta" 
                                    onClick={() => {
                                        //modifyInfoProva(prova.id, "fet", true);
                                    }} />
                                </>
                            ) : (
                                <>
                                    <FaTimesCircle title="Indicar que s'ha fet" className="icon-no-feta" 
                                    onClick={() => {
                                        //modifyInfoProva(prova.id, "fet", false);
                                    }} />
                                </>
                            )}
                            <FaRegStar title="Afegir a favorits" className={`icon-favorit ${prova.favorita ? "favorit-actiu" : ""}`} 
                            onClick={() => {
                                //modifyInfoProva(prova.id, "favorite", !prova.favorita);
                            }} />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProvesInici;