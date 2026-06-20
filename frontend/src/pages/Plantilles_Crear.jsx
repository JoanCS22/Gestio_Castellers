import { getCollesPositions } from "../services/collaService.js";
import {
    getPlantillaById, getPlantillesPositions, deletePlantilla, modifyUpperRelation,
    addPositionToPlantilla, modifyPositionFromPlantilla, deletePosicioPlantilla,
} from "../services/plantillesService.js";
import { handleApiError } from "../utils/handleApiError.js";

import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import {
    FaPlusSquare, FaTimesCircle, FaPencilAlt, FaTrashAlt,
    FaVideo, FaVideoSlash, FaLink, FaUnlink
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import { useColla } from "../context/CollaContext.jsx";

import "./Plantilles_Crear.css";
import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";

function PlantillesCrear() {
    const navigate = useNavigate();
    const { currentColla } = useColla();

    const boardRef = useRef(null);
    const nodeRefs = useRef({});

    const params = new URLSearchParams(location.search);
    const idPlantilla = params.get("id");

    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);
    const [infoPlantilla, setInfoPlantilla] = useState({});
    const [posicionsPlantilla, setPosicionsPlantilla] = useState([]);
    const [selectedTag, setSelectedTag] = useState("pinya");
    const [positions, setPositions] = useState([]);
    const [currentPosition, setCurrentPosition] = useState("");
    const [currentAddedPosition, setCurrentAddedPosition] = useState({
        color: "#d3d3d3", coord_x: 700, coord_y: 200, rotacio: "0"
    });
    const [newPosition, setNewPosition] = useState(true);
    const [selectedPositionId, setSelectedPositionId] = useState(null);
    const [relatedPositionId, setRelatedPositionId] = useState(null);
    const [isShown, setIsShown] = useState(false);
    const [isRelating, setIsRelating] = useState(false);

    const dragStart = useRef({ x: 0, y: 0 });
    const isDragging = useRef(false);

    const scrollStart = useRef({ x: 0, y: 0, sl: 0, st: 0 });
    const isScrollDragging = useRef(false);

    const showTempMessage = (msg, type = "success") => {
        setTempMessage({ message: msg, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCurrentAddedPosition(prev => ({ ...prev, [name]: value }));
    };

    const loadPlantillaById = async () => {
        try {
            const data = await getPlantillaById(idPlantilla);
            setInfoPlantilla(data);
            setSelectedTag(data.pinya ? "pinya" : "tronc");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadCollesPositions = async () => {
        try { setPositions(await getCollesPositions(currentColla.id)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const loadPlantillesPositions = async () => {
        try { setPosicionsPlantilla(await getPlantillesPositions(idPlantilla)); }
        catch (err) { handleApiError(err, navigate, setError); }
    };

    const addPosition = async () => {
        const selectedPositionData = positions.find(p => String(p.id) === String(currentPosition));
        if (!selectedPositionData) { setError("Cal emplenar la posició."); return; }
        try {
            const data = await addPositionToPlantilla(idPlantilla, selectedPositionData, currentAddedPosition, selectedTag);
            setSelectedPositionId(data.id);
            await loadPlantillesPositions();
            setNewPosition(false);
            setError("");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const modifyPosition = async (idPosicio, coordX = currentAddedPosition.coord_x, coordY = currentAddedPosition.coord_y) => {
        try {
            await modifyPositionFromPlantilla(idPosicio, currentAddedPosition, coordX, coordY);
            await loadPlantillesPositions();
            setError("");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const deletePosition = async (idPosicio) => {
        try {
            await deletePosicioPlantilla(idPosicio);
            setError("");
            showTempMessage("Posició eliminada correctament.");
            await loadPlantillesPositions();
            setSelectedPositionId(null);
            setNewPosition(true);
            setRelatedPositionId(null);
            setCurrentPosition("");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const deletePlantillaCall = async () => {
        if (!window.confirm("Segur que vols eliminar aquesta plantilla?")) return;
        try {
            await deletePlantilla(idPlantilla);
            showTempMessage("Plantilla eliminada correctament.");
            setTimeout(() => navigate("/plantilles"), 1500);
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    const changeUpperRelation = async (idPosicio, idPosicioUp = null) => {
        try {
            await modifyUpperRelation(idPosicio, idPosicioUp);
            await loadPlantillesPositions();
            setIsRelating(false);
            setRelatedPositionId(null);
            showTempMessage("Relacions modificades.");
        } catch (err) { handleApiError(err, navigate, setError); }
    };

    useEffect(() => {
        loadPlantillaById();
        loadCollesPositions();
        loadPlantillesPositions();
    }, []);

    useEffect(() => {
        if (!selectedPositionId) return;
        const selected = posicionsPlantilla.find(p => p.id === selectedPositionId);
        if (selected) setRelatedPositionId(selected.id_posicio_up);
    }, [posicionsPlantilla, selectedPositionId]);

    const handleBoardMouseDown = (e) => {
        if (e.target !== boardRef.current) return;
        isScrollDragging.current = true;
        scrollStart.current = {
            x: e.clientX, y: e.clientY,
            sl: boardRef.current.scrollLeft, st: boardRef.current.scrollTop
        };
    };
    const handleBoardMouseMove = (e) => {
        if (!isScrollDragging.current) return;
        boardRef.current.scrollLeft = scrollStart.current.sl - (e.clientX - scrollStart.current.x);
        boardRef.current.scrollTop = scrollStart.current.st - (e.clientY - scrollStart.current.y);
    };
    const handleBoardMouseUp = () => { isScrollDragging.current = false; };

    return (
        <div>
            <TopMenu
                title={infoPlantilla.nom}
                tornar
                leftIcons={
                    <div className="icon-btn" onClick={() => setIsShown(!isShown)}>
                        {isShown ? <FaVideoSlash /> : <FaVideo />}
                    </div>
                }
                rightIcons={
                    <div className="icon-btn" onClick={deletePlantillaCall}>
                        <FaTrashAlt />
                    </div>
                }
            />

            <div style={{
                display: "flex",
                height: "40px",
                borderBottom: "1px solid var(--outline-variant)",
                background: "var(--surface)",
            }}>
                <div style={{
                    width: isShown ? "0px" : "260px",
                    flexShrink: 0,
                    borderRight: isShown ? "none" : "1px solid var(--outline-variant)",
                    transition: "width 0.2s ease",
                    pointerEvents: "none",
                    overflow: "hidden"
                }} />

                <div className="modify-plantilla-sections" style={{ borderBottom: "none" }}>
                    {["pinya", "folre", "manilles", "puntals", "tronc"].map(tag =>
                        infoPlantilla[tag] && (
                            <div
                                key={tag}
                                className={`select-section-plantilla ${selectedTag === tag ? "active" : ""}`}
                                onClick={() => {
                                    setSelectedTag(tag);
                                    setIsRelating(false);
                                    setNewPosition(true);
                                    setSelectedPositionId(null);
                                }}
                            >
                                {tag.charAt(0).toUpperCase() + tag.slice(1)}
                            </div>
                        )
                    )}
                </div>
            </div>

            {message && <div className={`message ${message.type}`}>{message.message}</div>}

            {!isShown && (
                <aside className="modify-plantilla-lat-section">
                    <div className="panel-section-title">
                        <FaPlusSquare /> Nova posició
                    </div>

                    <div className="modify-plantilla-add-position">

                        <div className="panel-field">
                            <label className="field-plantilla-position">Tipus de posició</label>
                            <div className="select-wrapper-plantilla-position">
                                <select
                                    className="custom-select-plantilla-position"
                                    value={currentPosition}
                                    disabled={!newPosition}
                                    onChange={e => {
                                        const id = e.target.value;
                                        setCurrentPosition(id);
                                        setError("");
                                        const sel = positions.find(p => String(p.id) === String(id));
                                        if (sel) setCurrentAddedPosition(prev => ({ ...prev, color: sel.color || "#d3d3d3" }));
                                    }}
                                >
                                    <option value="">Selecciona posició</option>
                                    {positions.map(p => (
                                        <option key={p.id} value={String(p.id)}>{p.nom}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="select-wrapper-plantilla-color">
                            <span>Color de la fitxa</span>
                            <div className="color-preview-row">
                                <label
                                    className="color-preview-swatch"
                                    style={{ backgroundColor: currentAddedPosition.color, position: "relative" }}
                                    title="Canviar color"
                                >
                                    <input
                                        name="color"
                                        type="color"
                                        value={currentAddedPosition.color}
                                        onChange={handleChange}
                                        style={{
                                            position: "absolute", inset: 0,
                                            width: "100%", height: "100%",
                                            opacity: 0, cursor: "pointer", border: "none", padding: 0
                                        }}
                                    />
                                </label>
                                <span className="color-preview-value">{currentAddedPosition.color}</span>
                            </div>
                        </div>

                        <div className="select-wrapper-plantilla-coords">
                            <span>X</span>
                            <input name="coord_x" type="number" value={currentAddedPosition.coord_x} onChange={handleChange} />
                            <span>Y</span>
                            <input name="coord_y" type="number" value={currentAddedPosition.coord_y} onChange={handleChange} />
                        </div>

                        <div className="select-wrapper-plantilla-rotation">
                            <span>Rotació (graus)</span>
                            <input name="rotacio" type="number" value={currentAddedPosition.rotacio} onChange={handleChange} />
                        </div>

                        {error && <div className="error-message">{error}</div>}

                        {(currentPosition && selectedTag === "tronc") && (
                            <div className="select-wrapper-plantilla-buttons">
                                <Button
                                    text={isRelating ? "Cancel·lar" : relatedPositionId ? "Modificar relació" : "Afegir relació"}
                                    icon={isRelating ? <FaTimesCircle /> : <FaLink />}
                                    action={() => setIsRelating(!isRelating)}
                                />
                                {relatedPositionId && (
                                    <FaUnlink
                                        className="select-wrapper-plantilla-buttons-delete"
                                        onClick={() => changeUpperRelation(selectedPositionId)}
                                    />
                                )}
                            </div>
                        )}

                        <div className="select-wrapper-plantilla-buttons">
                            {newPosition ? (
                                <Button
                                    text="Afegir posició"
                                    icon={<FaPlusSquare />}
                                    action={async () => {
                                        if (!currentPosition) { setError("Selecciona una posició"); return; }
                                        const bw = boardRef.current?.offsetWidth || 1500;
                                        const bh = boardRef.current?.offsetHeight || 800;
                                        setCurrentAddedPosition(prev => ({
                                            ...prev,
                                            coord_x: prev.coord_x !== "" ? Number(prev.coord_x) : bw / 2 - 60,
                                            coord_y: prev.coord_y !== "" ? Number(prev.coord_y) : bh / 2 - 12,
                                        }));
                                        await addPosition();
                                    }}
                                />
                            ) : (
                                <>
                                    <Button
                                        text="Modificar posició"
                                        icon={<FaPencilAlt />}
                                        action={() => modifyPosition(selectedPositionId)}
                                    />
                                    <FaTrashAlt
                                        className="select-wrapper-plantilla-buttons-delete"
                                        onClick={() => deletePosition(selectedPositionId)}
                                    />
                                </>
                            )}
                        </div>

                        <hr className="panel-divider" />
                        <div className="panel-instructions">
                            <div className="panel-instruction-item">🖱 Click per seleccionar</div>
                            <div className="panel-instruction-item">✋ Arrossega per moure</div>
                        </div>
                    </div>
                </aside>
            )}

            <div
                className={`modify-plantilla-board ${isRelating ? "relating-mode" : ""}`}
                ref={boardRef}
                style={{ left: isShown ? "0px" : "260px", zIndex: 1 }}
                onMouseDown={handleBoardMouseDown}
                onMouseMove={handleBoardMouseMove}
                onMouseUp={handleBoardMouseUp}
                onMouseLeave={handleBoardMouseUp}
            >
                {isRelating && (
                    <div className="relating-banner">Selecciona una posició per relacionar-la</div>
                )}

                <div style={{ position: "relative", width: "2000px", height: "1500px" }}>
                    {posicionsPlantilla
                        .filter(p => p.seccio === selectedTag)
                        .map(posicio => (
                            <Draggable
                                key={posicio.id}
                                nodeRef={
                                    nodeRefs.current[posicio.id] ||
                                    (nodeRefs.current[posicio.id] = React.createRef())
                                }
                                position={{ x: posicio.coord_x, y: posicio.coord_y }}
                                onStart={e => {
                                    if (isShown) return false;
                                    dragStart.current = { x: e.clientX, y: e.clientY };
                                    isDragging.current = false;
                                }}
                                onDrag={e => {
                                    if (isShown) return false;
                                    const dx = Math.abs(e.clientX - dragStart.current.x);
                                    const dy = Math.abs(e.clientY - dragStart.current.y);
                                    if (dx > 5 || dy > 5) isDragging.current = true;
                                }}
                                onStop={async (e, data) => {
                                    if (isShown) return false;
                                    setPosicionsPlantilla(prev =>
                                        prev.map(p => p.id === posicio.id
                                            ? { ...p, coord_x: data.x, coord_y: data.y }
                                            : p
                                        )
                                    );
                                    if (selectedPositionId === posicio.id) {
                                        setCurrentAddedPosition(prev => ({ ...prev, coord_x: data.x, coord_y: data.y }));
                                        await modifyPosition(selectedPositionId, data.x, data.y);
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
                                            if (isShown) { setSelectedPositionId(null); setRelatedPositionId(null); setNewPosition(true); setCurrentPosition(""); return; }
                                            if (isRelating) { changeUpperRelation(selectedPositionId, posicio.id); return; }
                                            if (isDragging.current) return;

                                            if (selectedPositionId === posicio.id) {
                                                setSelectedPositionId(null); setNewPosition(true); setRelatedPositionId(null); setCurrentPosition(""); return;
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
                        ))
                    }
                </div>
            </div>
        </div>
    );
}

export default PlantillesCrear;