import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch } from "react-icons/fa";

import './Etiquetes_Inici.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

function Etiquetes() {

    const location = useLocation();

    const isPosition = location.pathname === "/etiquetes";
    const isRole = location.pathname === "/rols";

    return (
        <div>
            <TopMenu
                title={{ isPosition } ? 'Posicions' : 'Rols'}
            />
            <div className="selection-bar">
                <div className='position-select'>Posicions</div>
                <div className='grups-select'>Grups</div>
                <div className='rols-select'>Rols</div>
            </div>
            <div className="button-section">
                <Button
                    text={{ isPosition } ? 'Afegir posició' : 'Afegir rol'}
                    icon={<FaPlusSquare />}
                    action={() => { }}
                />
            </div>
            <div className="search-bar">
                <span>Cercar:</span>
                <FaSearch className="search-icon" />
                <input type='search' placeholder='Cercar...'></input>
            </div>
            <div className="table-posicions">
                <table>
                    <tr>
                        <th>Posició</th>
                        <th>Descripció</th>
                        <th>Modificar</th>
                        <th>Eliminar</th>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Etiquetes;