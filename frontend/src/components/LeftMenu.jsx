import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import {
    FaBars, FaOutdent, FaCaretDown, FaCaretUp,
    FaHome, FaCalendarAlt, FaDraftingCompass, FaUsers,
    FaCog, FaSignOutAlt, FaBell, FaLayerGroup
} from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx";
import './LeftMenu.css';

import { useEvent } from "../context/EventContext.jsx";
import { useColla } from "../context/CollaContext.jsx";

const LeftMenu = () => {
    const { currentColla } = useColla();
    const navigate = useNavigate();
    const location = useLocation();

    const [openLeft, setOpenLeft] = useState(false);
    const [openMenuAgenda, setOpenAgenda] = useState(false);
    const [openMenuColla, setOpenColla] = useState(false);

    const storedId = localStorage.getItem("id_colla");

    const permissions = getPermissions();
    const hasAccess = (key) => permissions[key] !== "X";
    const hasWritePermission = (key) => permissions[key] === "W";

    const { currentEvent } = useEvent();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        setOpenLeft(false);
        setOpenAgenda(false);
        setOpenColla(false);
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    return (
        <div className={`left-menu ${openLeft ? "open" : "closed"}`}>

            <div
                className="left-menu-button"
                title={openLeft ? "Amagar menú" : "Desplegar menú"}
                onClick={() => setOpenLeft(!openLeft)}
            >
                {openLeft ? <FaOutdent /> : <FaBars />}
            </div>

            {openLeft && (
                <>
                    <div className="menu-foto">
                        <img
                            src="LogoPlaca.png"
                            alt="Logo La Plaça"
                            title="Menú principal"
                            onClick={() => {
                                setOpenLeft(false);
                                navigate("/dashboard");
                            }}
                        />
                        <span className="menu-title">La Plaça</span>
                    </div>

                    <nav className="menu-content">
                        {storedId != null ? (
                            <>
                                <div
                                    className={`nav-item ${isActive("/dashboard") ? "nav-item--active" : ""}`}
                                    onClick={() => navigate("/dashboard")}
                                >
                                    <FaHome />
                                    <span>Inici</span>
                                </div>

                                <div
                                    className="nav-item"
                                    onClick={() => setOpenAgenda(!openMenuAgenda)}
                                >
                                    <FaCalendarAlt />
                                    <span>Agenda</span>
                                    <span className="nav-item-chevron">
                                        {openMenuAgenda ? <FaCaretUp /> : <FaCaretDown />}
                                    </span>
                                </div>

                                {openMenuAgenda && (
                                    <div className="submenu">
                                        {hasAccess("esdeveniments") && (
                                            <div
                                                className="submenu-item"
                                                onClick={() => navigate("/esdeveniments")}
                                            >
                                                Esdeveniments
                                            </div>
                                        )}
                                        {hasAccess("proves") && currentEvent && (
                                            <div
                                                className="submenu-item"
                                                onClick={() => navigate(`/proves?idEsdeveniment=${currentEvent.id}&nomEsdeveniment=${encodeURIComponent(currentEvent.nom)}`)}
                                            >
                                                Proves
                                            </div>
                                        )}
                                        {hasAccess("assistencia") && currentEvent && (
                                            <div
                                                className="submenu-item"
                                                onClick={() => {
                                                    if (hasWritePermission("esdeveniments")) {
                                                        navigate(`/assistencia?idEsdeveniment=${currentEvent.id}&nomEsdeveniment=${encodeURIComponent(currentEvent.nom)}`);
                                                    } else {
                                                        navigate(`/assistencia_usuari?idEsdeveniment=${currentEvent.id}`);
                                                    }
                                                }}
                                            >
                                                Assistència
                                            </div>
                                        )}
                                    </div>
                                )}

                                {hasAccess("plantilles") && (
                                    <div
                                        className={`nav-item ${isActive("/plantilles") ? "nav-item--active" : ""}`}
                                        onClick={() => navigate("/plantilles")}
                                    >
                                        <FaDraftingCompass />
                                        <span>Plantilles</span>
                                    </div>
                                )}

                                {hasAccess("notificacions") && (
                                    <div
                                        className={`nav-item ${isActive("/notificacions_board") ? "nav-item--active" : ""}`}
                                        onClick={() => navigate("/notificacions_board")}
                                    >
                                        <FaBell />
                                        <span>Notificacions</span>
                                    </div>
                                )}

                                <div
                                    className="nav-item"
                                    onClick={() => setOpenColla(!openMenuColla)}
                                >
                                    <FaUsers />
                                    <span>La colla</span>
                                    <span className="nav-item-chevron">
                                        {openMenuColla ? <FaCaretUp /> : <FaCaretDown />}
                                    </span>
                                </div>

                                {openMenuColla && (
                                    <div className="submenu">
                                        {hasAccess("colla") && (
                                            <div
                                                className="submenu-item"
                                                onClick={() => navigate("/get_data_colla")}
                                            >
                                                Informació colla
                                            </div>
                                        )}
                                        {hasAccess("membres") && (
                                            <div
                                                className="submenu-item"
                                                onClick={() => navigate("/members")}
                                            >
                                                Membres
                                            </div>
                                        )}
                                        {hasAccess("colla") && (
                                            <div
                                                className="submenu-item"
                                                onClick={() => navigate("/etiquetes")}
                                            >
                                                Etiquetes
                                            </div>
                                        )}
                                    </div>
                                )}


                            </>
                        ) : (
                            <div
                                className="nav-item"
                                onClick={() => {
                                    setOpenLeft(false);
                                    navigate("/create_colla");
                                }}
                            >
                                <FaLayerGroup />
                                <span>Crear colla</span>
                            </div>
                        )}
                    </nav>

                    <div className="menu-footer">
                        {/* <div
                            className={`nav-item ${isActive("/configuracio") ? "nav-item--active" : ""}`}
                            onClick={() => navigate("/configuracio")}
                        >
                            <FaCog />
                            <span>Configuració</span>
                        </div> */}
                        <div
                            className="nav-item nav-item--danger"
                            onClick={handleLogout}
                        >
                            <FaSignOutAlt />
                            <span>Sortir</span>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default LeftMenu;
