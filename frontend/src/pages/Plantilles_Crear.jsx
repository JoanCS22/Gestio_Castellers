import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare, FaTimesCircle, FaRegStar, FaPencilAlt } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import "./Plantilles_Crear.css"

import TopMenu from "../components/TopMenu.jsx";
import Button from "../components/Button.jsx";

function PlantillesCrear() {

    const navigate = useNavigate();

    const params = new URLSearchParams(location.search);
    const idPlantilla = params.get("idPlantilla");
    const nomPlantilla = params.get("nomPlantilla");
    const idColla = localStorage.getItem("id_colla");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);

    const [posicions, setPosicios] = useState([]);

    const [selectedTag, setSelectedTag] = useState("pinya");

    const [positions, setPositions] = useState([]);
    const [currentPosition, setCurrentPosition] = useState(null);

    const [currentAddedPosition, setCurrentAddedPosition] = useState(null);

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
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
                <div className="modify-plantilla-icons">

                </div>
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
                    <Button
                        text={"Afegir posició"}
                        icon={<FaPlusSquare />}
                        action={() => {}} />
                </div>
            </div>
            <div className="modify-plantilla-board">

            </div>
        </div>
    )
}

export default PlantillesCrear;