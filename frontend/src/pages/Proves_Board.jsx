import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaCheck, FaCheckDouble, FaVideoSlash, FaVideo, FaTrashAlt, FaTimesCircle, FaCheckCircle,
    FaRegStar, FaHashtag, FaEye, FaEyeSlash, FaPencilAlt, FaPlusSquare
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import "./Proves_Board.css"

import TopMenu from "../components/TopMenu.jsx";
import Input from "../components/Input.jsx";
import Button from "../components/Button.jsx";

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

    const [provaInfo, setProvaInfo] = useState(null);

    const [modalTags, setModalTags] = useState({
        nom: "",
        comentari: "",
        estructura: "",
        xarxa: false,
        public: false
    });
    const [selectedPlantilla, setSelectedPlantilla] = useState("");

    const [plantilles, setPlantilles] = useState([]);
    const [proves, setProves] = useState([]);
    const [members, setMembers] = useState([]);

    const [searchResults, setSearchResults] = useState([]);

    const [showCastell, setShowCastell] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [showModalProva, setShowModalProva] = useState(false);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const resetModal = () => {
        setShowModalProva(false);
        setSelectedPlantilla("");

        setModalTags({
            nom: "",
            descripcio: "",
            estructura: "",
            xarxa: false,
            public: false,
        });

        setError("");
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

    const getProvesByEsdeveniment = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/proves/getProvesByEsdeveniment?id=${provaInfo.id_esdeveniment}`, {
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

    const createOrModifyProva = async (action) => {

        const token = localStorage.getItem("token");

        const compulsoryInputs = {
            nom: "Nom",
            estructura: "Estructura"
        };

        for (const key in compulsoryInputs) {
            if (!modalTags[key] || modalTags[key].toString().trim() === "") {
                setError(`El camp ${compulsoryInputs[key]} és obligatori`);
                return;
            }
        }

        if (!selectedPlantilla) {
            setError("El camp Plantilla és obligatori");
            return;
        }

        const endPoint = action === "create" ? `createProva?id=${provaInfo.id_esdeveniment}`
            : `modifyInfoProva?id=${provaInfo.id}`;

        const response = await fetch(`http://localhost:5000/proves/${endPoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: modalTags.nom,
                comentari: modalTags.comentari,
                public: modalTags.public,
                xarxa: modalTags.xarxa,
                estructura: modalTags.estructura,
                id_plantilla: selectedPlantilla
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            if (editMode) {
                console.log("{DEBUG} Modify prova OK");
                showTempMessage("Prova modificada correctament.");
            } else {
                console.log("{DEBUG} Create prova OK");
                showTempMessage("Prova creada correctament.");
            }

            await getProvaById();
            resetModal();
        } else {
            if (editMode) {
                console.log("{DEBUG} Modify prova KO");
            } else {
                console.log("{DEBUG} Create prova KO");
            }
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
                nom: "",
                comentari: "",
                public: "",
                xarxa: "",
                estructura: "",
                id_plantilla: ""
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
        getCollesPlantilles();
        getProvaById();
    }, []);

    useEffect(() => {
        if (provaInfo?.id) {
            getProvesByEsdeveniment();
        }
    }, [provaInfo?.id]);

    return (
        <div>
            <TopMenu
                title={provaInfo ? `${provaInfo.nom} - ${provaInfo.estructura}` : "Carregant prova..."}
                tornar
                leftIcons={
                    <>
                        {provaInfo?.xarxa && (
                            <div className="icon-btn" title="Prova amb xarxa">
                                <FaHashtag />
                            </div>
                        )}
                        <div className="icon-btn" title={provaInfo?.feta ? "Prova realitzada" : "Prova no realitzada"} onClick={() => {
                            updateFeta(provaInfo.id, !provaInfo?.feta);
                        }}>
                            {provaInfo?.feta ? (
                                <FaCheckCircle className="icon-feta" />
                            ) : (
                                <FaTimesCircle className="icon-no-feta" />
                            )}
                        </div>
                        <div className="icon-btn" title={provaInfo?.favorita ? "Treure de favorits" : "Afegir a favorits"} onClick={() => {
                            updateFavorite(provaInfo.id, !provaInfo.favorita);
                        }}>
                            <FaRegStar className={`icon-favorit ${provaInfo?.favorita ? "favorit-actiu" : ""}`} />
                        </div>
                    </>
                }

                rightIcons={
                    <>
                        <div className="icon-btn" title={showCastell ? "Projectar castell" : "Editar castell"}
                            onClick={() => { setShowCastell(!showCastell) }}>
                            {showCastell ? (
                                <FaVideoSlash />
                            ) : (
                                <FaVideo />
                            )}
                        </div>
                        <div className="icon-btn" title={provaInfo?.public ? "Prova pública" : "Prova no pública"} onClick={() => {
                            publishProva(provaInfo.id, !provaInfo.public);
                        }}>
                            {provaInfo?.public ? (
                                <FaEye />
                            ) : (
                                <FaEyeSlash />
                            )}
                        </div>
                        <div className="icon-btn" title="Editar informació prova" onClick={() => {
                            setModalTags({
                                nom: provaInfo.nom,
                                descripcio: provaInfo.descripcio,
                                estructura: provaInfo.estructura,
                                xarxa: provaInfo.xarxa,
                                public: provaInfo.public,
                            });
                            setSelectedPlantilla(provaInfo.id_plantilla);
                            setEditMode(true);
                            setShowModalProva(true);
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

            {showModalProva && (
                <div className="modal-overlay-proves">
                    <div className="modal-proves">
                        <h2>
                            {editMode ? "Modificar informació prova" : "Crear nova prova"}
                        </h2>
                        <div className="input-group-proves">
                            <Input
                                name="name"
                                type="text"
                                placeholder="Nom"
                                value={modalTags.nom}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, nom: e.target.value })
                                }
                                inputTitle="Nom"
                            />
                            <Input
                                name="estructura"
                                type="text"
                                placeholder="Estructura"
                                value={modalTags.estructura}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, estructura: e.target.value })
                                }
                                inputTitle="Estructura"
                            />
                        </div>
                        <div>Comentari</div>
                        <div className="input-group-proves">
                            <textarea
                                placeholder="Comentari"
                                value={modalTags.comentari}
                                onChange={(e) =>
                                    setModalTags({ ...modalTags, comentari: e.target.value })
                                }
                            />
                        </div>
                        <div className="modal-checkboxes-proves">

                            <div className="input-item-proves">
                                <label className="field-prova-plantilla">Plantilla</label>
                                <div className="select-wrapper-plantilla">
                                    <select
                                        value={selectedPlantilla}
                                        onChange={(e) => setSelectedPlantilla(e.target.value)}
                                        className="custom-select-prova-plantilla"
                                    >
                                        <option value="">Selecciona plantilla</option>

                                        {plantilles.map(r => (
                                            <option key={r.id} value={String(r.id)}>
                                                {r.nom}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="checkbox-item-proves">
                                <span>Xarxa</span>
                                <input
                                    type="checkbox"
                                    checked={modalTags.xarxa}
                                    onChange={(e) => setModalTags({ ...modalTags, xarxa: e.target.checked })}
                                />
                            </div>

                            <div className="checkbox-item-proves">
                                <span>Públic?</span>
                                <input
                                    type="checkbox"
                                    checked={modalTags.public}
                                    onChange={(e) => setModalTags({ ...modalTags, public: e.target.checked })}
                                />
                            </div>
                        </div>
                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}
                        <div className="modal-buttons-proves">

                            {editMode ? (
                                <Button
                                    text={"Editar prova"}
                                    icon={<FaPencilAlt />}
                                    action={() => { createOrModifyProva("modify") }}
                                />
                            ) : (
                                <Button
                                    text={"Crear prova"}
                                    icon={<FaPlusSquare />}
                                    action={() => { createOrModifyProva("create") }}
                                />
                            )}

                            <Button
                                text="Cancelar"
                                icon={<FaTimesCircle />}
                                action={() => { resetModal(); }}
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ProvesBoard;