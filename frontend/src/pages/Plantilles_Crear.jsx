import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Draggable from "react-draggable";

import { FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare, FaTimesCircle, FaRegStar, FaPencilAlt } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import "./Plantilles_Crear.css"

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";

function PlantillesCrear() {

    const navigate = useNavigate();

    const boardRef = useRef(null);
    const nodeRefs = useRef({});

    const params = new URLSearchParams(location.search);
    const idPlantilla = params.get("idPlantilla");
    const nomPlantilla = params.get("nomPlantilla");
    const idColla = localStorage.getItem("id_colla");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);

    const [posicionsPlantilla, setPosiciosPlantilla] = useState([]);

    const [selectedTag, setSelectedTag] = useState("pinya");

    const [positions, setPositions] = useState([]);
    const [currentPosition, setCurrentPosition] = useState("");

    const [currentAddedPosition, setCurrentAddedPosition] = useState({
        color: "#d3d3d3",
        coord_x: "700",
        coord_y: "200",
        rotacio: "0"
    });

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

    const addPositionToPlantilla = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch(`http://localhost:5000/plantilles/addPositionToPlantilla?id=${idPlantilla}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({
                nom: currentPosition, 
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

            await getCollesPositions();

            setError("");
            showTempMessage("Posició creada.");
        } else {
            console.log("{DEBUG} Create posició de plantilla KO");
            setError(data.message);
        }
    }

    useEffect(() => {
        getCollesPositions();
    }, []);

    return (
        <div>
            <TopMenu
                title={nomPlantilla}
                tornar
            />
            <div className="modify-plantilla-sections">
                <div className={`pinya-select-plantilla ${selectedTag === "pinya" ? "active" : ""}`} onClick={() => {
                    setSelectedTag("pinya");
                }}>Pinya</div>
                <div className={`tronc-select-plantilla ${selectedTag === "tronc" ? "active" : ""}`} onClick={() => {
                    setSelectedTag("tronc");
                }}>Tronc</div>
                <div className='other-select-plantilla'>+ Afegir secció</div>
            </div>
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
            <div className="modify-plantilla-lat-section">
                <div className="modify-plantilla-add-position">
                    <label className="field-plantilla-position">Posició</label>

                    <div className="select-wrapper-plantilla-position">
                        <select
                            value={currentPosition}
                            onChange={(e) => setCurrentPosition(e.target.value)}
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
                    <Button
                        text={"Afegir posició"}
                        icon={<FaPlusSquare />}
                        action={() => {

                            if (!currentPosition) {
                                setError("Selecciona una posició");
                                return;
                            }

                            const selectedPositionData = positions.find(
                                p => String(p.id) === String(currentPosition)
                            );

                            const boardWidth = boardRef.current?.offsetWidth || 1500;
                            const boardHeight = boardRef.current?.offsetHeight || 800;

                            const blockWidth = 120;
                            const blockHeight = 40;

                            const centerX = (boardWidth / 2) - (blockWidth / 2);
                            const centerY = (boardHeight / 2) - (blockHeight / 2);

                            const newPosition = {
                                id: Date.now(),
                                position_id: currentPosition,
                                nom: selectedPositionData.nom,
                                color: currentAddedPosition.color || "#cccccc",
                                coord_x: currentAddedPosition.coord_x !== ""
                                    ? Number(currentAddedPosition.coord_x)
                                    : centerX,
                                coord_y: currentAddedPosition.coord_y !== ""
                                    ? Number(currentAddedPosition.coord_y)
                                    : centerY,
                                rotacio: Number(currentAddedPosition.rotacio) || 0
                            };

                            setPosiciosPlantilla(prev => [
                                ...prev,
                                newPosition
                            ]);
                        }}
                    />
                </div>
            </div>
            <div className="modify-plantilla-board" ref={boardRef}>

                {posicionsPlantilla.map((posicio) => (

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

                        onStop={(e, data) => {

                            setPosiciosPlantilla(prev =>
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
                        }}
                    >
                        <div ref={nodeRefs.current[posicio.id]}>

                            <div
                                className="bloc-posicio-plantilla"

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