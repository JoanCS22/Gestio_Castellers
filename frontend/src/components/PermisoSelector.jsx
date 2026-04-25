import './PermisoSelector.css';

import { FaTimesCircle, FaPencilAlt, FaRegEye } from "react-icons/fa";


const PermisoSelector = ({ label, value, onChange }) => (
    <div className="permiso-row">
        <span>{label}</span>

        <div className="permisos-container">
            <button
                className={value === "X" ? "active" : ""}
                onClick={() => onChange("X")}
            >
                <FaTimesCircle />
            </button>

            <button
                className={value === "R" ? "active" : ""}
                onClick={() => onChange("R")}
            >
                <FaRegEye />
            </button>

            <button
                className={value === "W" ? "active" : ""}
                onClick={() => onChange("W")}
            >
                <FaPencilAlt />
            </button>
        </div>
    </div>
);

export default PermisoSelector;