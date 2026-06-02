import {
    getCollesPositions
} from "../services/collaService.js";
import {
    getPlantillaById, getPlantillesPositions, deletePlantilla, modifyUpperRelation,
    addPositionToPlantilla, modifyPositionFromPlantilla, deletePosicioPlantilla,
} from "../services/plantillesService.js";
import { handleApiError } from "../utils/handleApiError.js";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare, FaTimesCircle,
    FaStar, FaPencilAlt, FaTrashAlt, FaTrash, FaVideo, FaVideoSlash, FaLink, FaUnlink
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import { useColla } from "../context/CollaContext.jsx";

import "./Plantilles_Crear.css"

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";

function PlantillesCrear() {

    const navigate = useNavigate();

    const { currentColla, loadingColles } = useColla();

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

    const [relatedPositionId, setRelatedPositionId] = useState(null);

    const dragStart = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);

    const [isShown, setIsShown] = useState(false);

    const [isRelating, setIsRelating] = useState(false);

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

    const loadPlantillaById = async () => {
        try {
            const data = await getPlantillaById(idPlantilla);
            setInfoPlantilla(data);
            setSelectedTag(data.pinya ? "pinya" : "tronc")
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadCollesPositions = async () => {
        try {
            const data = await getCollesPositions(currentColla.id);
            setPositions(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const loadPlantillesPositions = async () => {
        try {
            const data = await getPlantillesPositions(idPlantilla);
            setPosicionsPlantilla(data);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const addPosition = async () => {
        const selectedPositionData = positions.find(
            p => String(p.id) === String(currentPosition)
        );
        if (!selectedPositionData) {
            setError("Cal emplenar la posició.");
            return;
        }

        try {
            const data = await addPositionToPlantilla(idPlantilla, selectedPositionData, currentAddedPosition, selectedTag);
            await loadPlantillesPositions();
            setError("");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const modifyPosition = async (
        idPosicio,
        coordX = currentAddedPosition.coord_x,
        coordY = currentAddedPosition.coord_y
    ) => {
        try {
            const data = await modifyPositionFromPlantilla(idPosicio, currentAddedPosition, coordX, coordY);
            await loadPlantillesPositions();
            setError("");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const deletePosition = async (idPosicio) => {
        try {
            const data = await deletePosicioPlantilla(idPosicio);
            setError("");
            showTempMessage("Posició eliminada correctament.");
            await loadPlantillesPositions();
            setSelectedPositionId(null);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const deletePlantillaCall = async () => {
        if (!window.confirm("Segur que vols eliminar aquesta plantilla?")) return;
        try {
            const data = await deletePlantilla(idPlantilla);
            setError("");
            showTempMessage("Plantilla eliminada correctament.");
            await loadPlantillesPositions();
            setSelectedPositionId(null);
            setTimeout(() => {
                navigate("/plantilles");
            }, 1500);
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    const changeUpperRelation = async (idPosicio, idPosicioUp = null) => {
        try {
            await modifyUpperRelation(idPosicio, idPosicioUp);
            await loadPlantillesPositions();
            setIsRelating(false);
            setRelatedPositionId(null);
            setError("");
            showTempMessage("Relacions modificades.");
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    }

    useEffect(() => {
        loadPlantillaById();
        loadCollesPositions();
        loadPlantillesPositions();
    }, []);

    useEffect(() => {
        if (!selectedPositionId) return;

        const selected = posicionsPlantilla.find(
            p => p.id === selectedPositionId
        );

        if (selected) {
            setRelatedPositionId(selected.id_posicio_up);
        }
    }, [posicionsPlantilla, selectedPositionId]);

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
                        <div className="icon-btn" onClick={deletePlantillaCall}>
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
                            setIsRelating(false);
                            setNewPosition(true);
                            setSelectedPositionId(null);
                        }}>Pinya</div>
                    </>
                )}
                {infoPlantilla.folre && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "folre" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("folre");
                            setIsRelating(false);
                            setNewPosition(true);
                            setSelectedPositionId(null);
                        }}>Folre</div>
                    </>
                )}
                {infoPlantilla.manilles && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "manilles" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("manilles");
                            setIsRelating(false);
                            setNewPosition(true);
                            setSelectedPositionId(null);
                        }}>Manilles</div>
                    </>
                )}
                {infoPlantilla.puntals && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "puntals" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("puntals");
                            setIsRelating(false);
                            setNewPosition(true);
                            setSelectedPositionId(null);
                        }}>Puntals</div>
                    </>
                )}
                {infoPlantilla.tronc && (
                    <>
                        <div className={`select-section-plantilla ${selectedTag === "tronc" ? "active" : ""}`} onClick={() => {
                            setSelectedTag("tronc");
                            setIsRelating(false);
                            setNewPosition(true);
                            setSelectedPositionId(null);
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
                                    className="custom-select-plantilla-position"
                                    value={currentPosition}
                                    disabled={!newPosition}
                                    onChange={(e) => {
                                        const selectedId = e.target.value;

                                        setCurrentPosition(selectedId);
                                        setError("");

                                        const selected = positions.find(
                                            (p) => String(p.id) === String(selectedId)
                                        );

                                        if (selected) {
                                            setCurrentAddedPosition((prev) => ({
                                                ...prev,
                                                color: selected.color || "#d3d3d3"
                                            }));
                                        }
                                    }}
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
                            <div className="select-wrapper-plantilla-buttons" title="Relacionar amb posicions de dalt per acumular alçades a proves">
                                {(currentPosition && selectedTag === "tronc") && (
                                    <>
                                        <Button
                                            text={isRelating ? "Cancel·lar" : relatedPositionId ? "Modificar relació" : "Afegir relació"}
                                            icon={isRelating ? <FaTimesCircle /> : <FaLink />}
                                            action={async () => {
                                                setIsRelating(!isRelating);
                                            }}
                                        />
                                        {relatedPositionId && (
                                            <FaUnlink
                                                className="select-wrapper-plantilla-buttons-delete"
                                                onClick={async () => {
                                                    await changeUpperRelation(selectedPositionId);
                                                }}
                                            />
                                        )}
                                    </>
                                )}
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

                                            await addPosition();
                                        }}
                                    />
                                </>) : (<>

                                    <Button
                                        text={"Modificar posició"}
                                        icon={<FaPencilAlt />}
                                        action={async () => {
                                            await modifyPosition(selectedPositionId);
                                        }}
                                    />
                                    <FaTrashAlt
                                        className="select-wrapper-plantilla-buttons-delete"
                                        onClick={async () => {
                                            await deletePosition(selectedPositionId);
                                        }}
                                    />
                                </>)}

                            </div>
                        </div>
                    </div>
                </>
            )}
            <div className={`modify-plantilla-board ${isRelating ? "relating-mode" : ""}`} ref={boardRef}>
                {isRelating && (
                    <div className="relating-banner">
                        Selecciona una posició per relacionar-la
                    </div>
                )}
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

                                await modifyPosition(
                                    selectedPositionId,
                                    newX,
                                    newY
                                );
                            }
                        }}
                    >
                        <div ref={nodeRefs.current[posicio.id]}>

                            <div
                                className={`bloc-posicio-plantilla 
                                    ${selectedPositionId === posicio.id ? "selected-bloc" : ""}
                                    ${relatedPositionId === posicio.id ? "related-bloc" : ""}
                                    ${isRelating ? "relating-bloc" : ""}
                                `}

                                onClick={() => {

                                    if (isShown) {
                                        setSelectedPositionId(null);
                                        setNewPosition(true);
                                        setCurrentPosition("");
                                        return;
                                    }

                                    if (isRelating) {
                                        changeUpperRelation(selectedPositionId, posicio.id);
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
                                    setRelatedPositionId(posicio.id_posicio_up);

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