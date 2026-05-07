import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch, FaUserEdit, FaArrowLeft, FaRegCheckSquare, FaTimesCircle, FaRegStar, FaPencilAlt } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

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

    return (
        <div>
            <TopMenu
                title={nomPlantilla}
                tornar
            />
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
        </div>
    )
}

export default PlantillesCrear;