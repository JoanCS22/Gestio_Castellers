import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaPlusSquare, FaSearch } from "react-icons/fa";

import './Etiquetes_Inici.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

function Etiquetes() {

    const location = useLocation();

    const [selectedTag, setSelectedTag] = useState("posicions");
    const [positions, setPositions] = useState([]);
    const [message, setTempMessage] = useState(null);

    const isPosition = selectedTag === "posicions";
    const isRole = selectedTag === "rols";

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const getCollesPositions = async () => {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/colla/getCollaPositions", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

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
            {
                message && (
                    <div className={`message ${message.type}`}>
                        {message.message}
                    </div>
                )
            }
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
                    {positions.map((position) => (
                        <React.Fragment key={position.id}>
                            <tbody>
                                <tr>
                                    <td>{position.nom}</td>
                                    <td>{position.descripcio}</td>
                                    <td>✏️</td>
                                    <td>🗑️</td>
                                </tr>
                            </tbody>
                        </React.Fragment>
                    ))}
                </table>
            </div>
        </div>
    )
}

export default Etiquetes;