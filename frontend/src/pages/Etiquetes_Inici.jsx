import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch } from "react-icons/fa";

import './Etiquetes_Inici.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

function Etiquetes() {

    const location = useLocation();

    const [selectedTag, setSelectedTag] = useState("posicions");

    const isPosition = selectedTag === "posicions";
    const isRole = selectedTag === "rols";

    return (
        <div>
            <TopMenu
                title={isPosition ? 'Posicions' : 'Rols'}
            />
            <div className="selection-bar-tags">
                <div className={`position-select-tags ${isPosition ? "active" : ""}`} onClick={() => {
                    setSelectedTag("posicions");
                }}>Posicions</div>
                <div className='grups-select-tags'>Grups</div>
                <div className={`rols-select-tags ${isRole ? "active" : ""}`} onClick={() => {
                    setSelectedTag("rols");
                }}>Rols</div>
            </div>
            <div className="button-section-tags">
                <Button
                    text={isPosition ? 'Afegir posició' : 'Afegir rol'}
                    icon={<FaPlusSquare />}
                    action={() => { }}
                />
            </div>
            <div className="search-bar-tags">
                <span>Cercar:</span>
                <FaSearch className="search-icon-tags" />
                <input type='search' placeholder='Cercar...'></input>
            </div>
            <div className="table-posicions-tags">
                <table>
                    <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "40%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "20%" }} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Posició</th>
                            <th>Descripció</th>
                            <th>Modificar</th>
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Posició 1</td>
                            <td>Descripció prova</td>
                            <td>✏️</td>
                            <td>🗑️</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Etiquetes;