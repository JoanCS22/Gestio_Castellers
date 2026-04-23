import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch } from "react-icons/fa";

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

function Etiquetes() {
    return (
        <div>
            <TopMenu
                title='Etiquetes'
            />
            <div className="selection-bar">
                <span>Posicions</span>
                <span>Grups</span>
                <span>Rols</span>
            </div>
            <div className="button-section">
                <Button
                    text="Afegir etiqueta"
                    icon={<FaPlusSquare />}
                    action={() => { }}
                />
            </div>
            <div className="search-bar">
                <span>Cercar:</span>
                <FaSearch className="search-icon"/>
                <input type='search' placeholder='Cercar...'></input>
            </div>
            <div className="table">
                <span>Posició</span>
                <span>Descripció</span>
                <span>Modificar</span>
                <span>Eliminar</span>
            </div>
        </div>
    )
}

export default Etiquetes;