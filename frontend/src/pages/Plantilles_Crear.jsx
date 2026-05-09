import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare, FaTimesCircle,
    FaRegStar, FaPencilAlt, FaTrashAlt, FaTrash, FaVideo, FaVideoSlash
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import "./Plantilles_Crear.css"

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";

function PlantillesCrear() {

    const navigate = useNavigate();

    const boardRef = useRef(null);
    const nodeRefs = useRef({});

    const params = new URLSearchParams(location.search);
    const idPlantilla = params.get("id");
    const idColla = localStorage.getItem("id_colla");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);

    const [infoPlantilla, setInfoPlantilla] = useState([]);
    const [posicionsPlantilla, setPosicionsPlantilla] = useState([]);

    const [selectedTag, setSelectedTag] = useState("pinya");

    const [positions, setPositions] = useState([]);
    const [currentPosition, setCurrentPosition] = useState("");

    const [currentAddedPosition, setCurrentAddedPosition] = useState({
        color: "#d3d3d3",
        coord_x: Number(700),
        coord_y: Number(200),
        rotacio: "0"
    });

    const [newPosition, setNewPosition] = useState(true);
    const [selectedPositionId, setSelectedPositionId] = useState(null);

    const dragStart = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);

    const [isShown, setIsShown] = useState(false);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentAddedPosition((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const getPlantillaById = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/plantilles/getPlantillaById?id=${idPlantilla}`, {
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
            setInfoPlantilla(data);
            setSelectedTag(data.pinya ? "pinya" : "tronc")
            console.log(data);
            console.log("{DEBUG} Get plantilla by id OK")
        } else {
            console.log("{DEBUG} Get plantilla by id KO")
            setError(data.message);
        }
    }

    const getCollesPositions = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/colla/getCollaPositions?id=${idColla}`, {
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
            setPositions(data);
            console.log("{DEBUG} Get colla's positions OK")
        } else {
            console.log("{DEBUG} Get colla's positions KO")
            setError(data.message);
        }
    }

    const getPlantillesPositions = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/plantilles/getPositionsByPlantilla?id=${idPlantilla}`, {
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
            setPosicionsPlantilla(data);
            console.log("{DEBUG} Get plantilla's positions OK")
        } else {
            console.log("{DEBUG} Get plantilla's positions KO")
            setError(data.message);
        }
    }

    const addPositionToPlantilla = async () => {

        const selectedPositionData = positions.find(
            p => String(p.id) === String(currentPosition)
        );

        if (!selectedPositionData) {
            setError("Cal emplenar la posició.");
            return;
        }

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/plantilles/addPositionToPlantilla?id=${idPlantilla}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: selectedPositionData?.nom,
                color: currentAddedPosition.color,
                coord_x: currentAddedPosition.coord_x,
                coord_y: currentAddedPosition.coord_y,
                rotacio: currentAddedPosition.rotacio,
                seccio: selectedTag,
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Create posició de plantilla OK");

            await getPlantillesPositions();

            setError("");
            showTempMessage("Posició creada.");
        } else {
            console.log("{DEBUG} Create posició de plantilla KO");
            setError(data.message);
        }
    }

    const modifyPositionToPlantilla = async (
        idPosicio,
        coordX = currentAddedPosition.coord_x,
        coordY = currentAddedPosition.coord_y
    ) => {
        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/plantilles/modifyPositionsFromPlantilla?id=${idPosicio}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                color: currentAddedPosition.color,
                coord_x: coordX,
                coord_y: coordY,
                rotacio: currentAddedPosition.rotacio
            }),
        });

        if (response.status === 401 || response.status === 403) {
            localStorage.clear();
            navigate("/login");
            return;
        }

        const data = await response.json();

        if (response.ok) {
            console.log("{DEBUG} Modify posició de plantilla OK");

            await getPlantillesPositions();

            setError("");
            showTempMessage("Posició modificada.");
        } else {
            console.log("{DEBUG} Modify posició de plantilla KO");
            setError(data.message);
        }
    }

    const deletePosicioPlantilla = async (idPosicio) => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/plantilles/deletePositionsFromPlantilla?id=${idPosicio}`, {
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
            console.log("{DEBUG} Delete posició OK");
            setError("");
            showTempMessage("Posició eliminada correctament.");
            await getPlantillesPositions();
            setSelectedPositionId(null);
        } else {
            console.log("{DEBUG} Delete posició KO");
            setError(data.message);
        }
    }

    const deletePlantilla = async () => {

        if (!window.confirm("Segur que vols eliminar aquesta plantilla?")) return;

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/plantilles/deletePlantilla?id=${idPlantilla}`, {
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
            console.log("{DEBUG} Delete plantilla OK");
            setError("");
            showTempMessage("Plantilla eliminada correctament.");
            await getPlantillesPositions();
            setSelectedPositionId(null);
            setTimeout(() => {
                navigate("/plantilles");
            }, 1500);
        } else {
            console.log("{DEBUG} Delete plantilla KO");
            setError(data.message);
        }
    }

    useEffect(() => {
        getPlantillaById();
        getCollesPositions();
        getPlantillesPositions();
    }, []);

    return (
        <div>
            <TopMenu
                title={infoPlantilla.nom}
                tornar
                leftIcons={
                    <>
                        <div className="icon-btn" onClick={() => { setIsShown(!isShown) }}>
                            {isShown ? (
                                <FaVideoSlash />
                            ) : (
                                <FaVideo />
                            )}
                        </div>
                    </>
                }

                rightIcons={
                    <>
                        <div className="icon-btn" onClick={deletePlantilla}>
                            <FaTrashAlt />
                        </div>
                    </>
                }
            />
            <div className="modify-plantilla-sections">
                {infoPlantilla.pinya && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "pinya" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("pinya");
                        }}>Pinya</div>
                    </>
                )}
                {infoPlantilla.folre && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "folre" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("folre");
                        }}>Folre</div>
                    </>
                )}
                {infoPlantilla.manilles && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "manilles" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("manilles");
                        }}>Manilles</div>
                    </>
                )}
                {infoPlantilla.puntals && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "puntals" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("puntals");
                        }}>Puntals</div>
                    </>
                )}
                {infoPlantilla.tronc && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "tronc" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("tronc");
                        }}>Tronc</div>
                    </>
                )}
            </div>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            {!isShown && (
                <>
                    <div className="modify-plantilla-lat-section">
                        <div className="modify-plantilla-add-position">
                            <label className="field-plantilla-position">Posició</label>

                            <div className="select-wrapper-plantilla-position">
                                <select
                                    value={currentPosition}
                                    disabled={!newPosition}
                                    onChange={(e) => {
                                        setCurrentPosition(e.target.value);
                                        setError("");
                                    }}
                                    className="custom-select-plantilla-position"
                                >
                                    <option value="">Selecciona posició</option>

                                    {positions.map(p => (
                                        <option key={p.id} value={String(p.id)}>
                                            {p.nom}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {error && (
                                <div className="error-message">
                                    {error}
                                </div>
                            )}
                            <div className="select-wrapper-plantilla-color">
                                <span>Color</span>
                                <input
                                    name="color"
                                    type="color"
                                    value={currentAddedPosition.color}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="select-wrapper-plantilla-coords">
                                <span>X</span>
                                <input
                                    name="coord_x"
                                    type="number"
                                    placeholder="X"
                                    value={currentAddedPosition.coord_x}
                                    onChange={handleChange}
                                />
                                <span>Y</span>
                                <input
                                    name="coord_y"
                                    type="number"
                                    placeholder="Y"
                                    value={currentAddedPosition.coord_y}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="select-wrapper-plantilla-rotation">
                                <span>Rotació</span>
                                <input
                                    name="rotacio"
                                    type="number"
                                    placeholder="Rotació"
                                    value={currentAddedPosition.rotacio}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="select-wrapper-plantilla-buttons">
                                {newPosition ? (<>
                                    <Button
                                        text={"Afegir posició"}
                                        icon={<FaPlusSquare />}
                                        action={async () => {

                                            if (!currentPosition) {
                                                setError("Selecciona una posició");
                                                return;
                                            }

                                            const boardWidth = boardRef.current?.offsetWidth || 1500;
                                            const boardHeight = boardRef.current?.offsetHeight || 800;

                                            const blockWidth = 120;
                                            const blockHeight = 40;

                                            const centerX = (boardWidth / 2) - (blockWidth / 2);
                                            const centerY = (boardHeight / 2) - (blockHeight / 2);

                                            const finalPosition = {
                                                ...currentAddedPosition,

                                                coord_x:
                                                    currentAddedPosition.coord_x !== ""
                                                        ? Number(currentAddedPosition.coord_x)
                                                        : centerX,

                                                coord_y:
                                                    currentAddedPosition.coord_y !== ""
                                                        ? Number(currentAddedPosition.coord_y)
                                                        : centerY,
                                            };

                                            setCurrentAddedPosition(finalPosition);

                                            await addPositionToPlantilla();
                                        }}
                                    />
                                </>) : (<>

                                    <Button
                                        text={"Modificar posició"}
                                        icon={<FaPencilAlt />}
                                        action={async () => {
                                            await modifyPositionToPlantilla(selectedPositionId);
                                        }}
                                    />
                                    <FaTrashAlt
                                        className="select-wrapper-plantilla-buttons-delete"
                                        onClick={async () => {
                                            await deletePosicioPlantilla(selectedPositionId);
                                        }}
                                    />
                                </>)}

                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className="modify-plantilla-board" ref={boardRef}>
                {posicionsPlantilla.filter(posicio => posicio.seccio === selectedTag).map((posicio) => (

                    <Draggable
                        key={posicio.id}

                        nodeRef={
                            nodeRefs.current[posicio.id] ||
                            (nodeRefs.current[posicio.id] = React.createRef())
                        }

                        position={{
                            x: posicio.coord_x,
                            y: posicio.coord_y
                        }}

                        onStart={(e) => {
                            if (isShown) return false;
                            dragStart.current = { x: e.clientX, y: e.clientY };
                            isDragging.current = false;
                        }}

                        onDrag={(e) => {
                            if (isShown) return false;
                            const dx = Math.abs(e.clientX - dragStart.current.x);
                            const dy = Math.abs(e.clientY - dragStart.current.y);

                            if (dx > 5 || dy > 5) {
                                isDragging.current = true;
                            }
                        }}

                        onStop={async (e, data) => {
                            if (isShown) return false;
                            setPosicionsPlantilla(prev =>
                                prev.map(p =>
                                    p.id === posicio.id
                                        ? {
                                            ...p,
                                            coord_x: data.x,
                                            coord_y: data.y
                                        }
                                        : p
                                )
                            );

                            if (selectedPositionId === posicio.id) {

                                const newX = data.x;
                                const newY = data.y;

                                setCurrentAddedPosition(prev => ({
                                    ...prev,
                                    coord_x: newX,
                                    coord_y: newY
                                }));

                                await modifyPositionToPlantilla(
                                    selectedPositionId,
                                    newX,
                                    newY
                                );
                            }
                        }}
                    >
                        <div ref={nodeRefs.current[posicio.id]}>

                            <div
                                className={`bloc-posicio-plantilla ${selectedPositionId === posicio.id ? "selected-bloc" : ""}`}

                                onClick={() => {

                                    if (isShown) {
                                        setSelectedPositionId(null);
                                        setNewPosition(true);
                                        setCurrentPosition("");
                                        return;
                                    }

                                    if (isDragging.current) {
                                        return;
                                    }

                                    if (selectedPositionId === posicio.id) {
                                        setSelectedPositionId(null);
                                        setNewPosition(true);
                                        setCurrentPosition("");
                                        return;
                                    }

                                    setCurrentPosition(String(posicio.position_id || posicio.id));
                                    setSelectedPositionId(posicio.id);

                                    setCurrentAddedPosition({
                                        color: posicio.color,
                                        coord_x: Number(posicio.coord_x),
                                        coord_y: Number(posicio.coord_y),
                                        rotacio: posicio.rotacio
                                    });

                                    setNewPosition(false);
                                }}

                                style={{
                                    backgroundColor: posicio.color,
                                    transform: `rotate(${posicio.rotacio}deg)`
                                }}
                            >
                                {posicio.nom}
                            </div>

                        </div>

                    </Draggable>
                ))}
            </div>
        </div>
    )
}

export default PlantillesCrear;