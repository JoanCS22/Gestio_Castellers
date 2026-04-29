import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt, FaPlusSquare, FaSearch } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Esdeveniments_Inici.css";
import { act } from "react";

function EsdevenimentsList() {
    const navigate = useNavigate();

    const location = useLocation();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [selectedTag, setSelectedTag] = useState("futurs");

    const [futurs, setFuturs] = useState([]);
    const [passats, setPassats] = useState([]);

    const [assaig, setAssaig] = useState(false);
    const [actuacio, setActuacio] = useState(false);
    const [altres, setAltres] = useState(false);
    const [tots, setTots] = useState(false);

    const isFuturs = selectedTag === "futurs";
    const isPassats = selectedTag === "passats";

    const currentEsdeveniments = isFuturs ? futurs : passats;

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    return (
        <div>
            <TopMenu
                title={`Esdeveniments ${isPassats ? "passats" : "futurs"}`}
            />
            <div className="selection-bar-esdeveniments">
                <div className={`passats-select-esdeveniments ${isPassats ? "active" : ""}`} onClick={() => {
                    setSelectedTag("passats");
                }}>Esdeveniments passats</div>
                <div className={`futurs-select-esdeveniments ${isFuturs ? "active" : ""}`} onClick={() => {
                    setSelectedTag("futurs");
                }}>Esdeveniments futurs</div>
            </div>
            {
                message && (
                    <div className={`message ${message.type}`}>
                        {message.message}
                    </div>
                )
            }
            <div className="button-section-esdeveniments">
                {((hasWritePermission("esdeveniments") && isFuturs)) && (
                    <>
                        <Button
                            text="Afegir esdeveniment"
                            icon={<FaPlusSquare />}
                            action={() => {
                                if (true) {
                                } else {
                                }
                            }}
                        />
                    </>
                )}
            </div>
            <div className="filters-esdeveniments">
                <div className="search-bar-esdeveniments">
                    <span>Cercar:</span>
                    <FaSearch className="search-icon-tags" />
                    <input type='search' placeholder='Cercar...'></input>
                </div>
                <div className="checkboxes-esdeveniments">
                    <span>Filtrar:</span>
                    <div className="checkbox-esdeveniments-assaig">
                        <span>Assaig:</span>
                        <div className="checkbox-container-esdeveniments">
                            <input
                                type="checkbox"
                                checked={assaig}
                                onChange={
                                    (e) => setAssaig(e.target.checked)
                                }
                            />
                        </div>
                    </div>
                    <div className="checkbox-esdeveniments-actuacio">
                        <span>Actuacio:</span>
                        <div className="checkbox-container-esdeveniments">
                            <input
                                type="checkbox"
                                checked={actuacio}
                                onChange={
                                    (e) => setActuacio(e.target.checked)
                                }
                            />
                        </div>
                    </div>
                    <div className="checkbox-esdeveniments-altres">
                        <span>Altres:</span>
                        <div className="checkbox-container-esdeveniments">
                            <input
                                type="checkbox"
                                checked={altres}
                                onChange={
                                    (e) => setAltres(e.target.checked)
                                }
                            />
                        </div>
                    </div>
                    <div className="checkbox-esdeveniments-tots">
                        <span>Tots:</span>
                        <div className="checkbox-container-esdeveniments">
                            <input
                                type="checkbox"
                                checked={tots}
                                onChange={
                                    (e) => setTots(e.target.checked)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className="table-esdeveniments">
                <table>
                    <colgroup>
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "20%" }} />
                        <col style={{ width: "45%" }} />
                    </colgroup>

                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th>Tipus</th>
                            <th>Data i hora</th>
                            <th>Accions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEsdeveniments.map((esdeveniment) => (
                            <>
                                <tr key={esdeveniment.id}>
                                    <td>{esdeveniment.nom}</td>
                                    <td>{esdeveniment.descripcio}</td>
                                    <td>
                                        <button onClick={() => {
                                            if (hasWritePermission("colla")) {
                                                setCurrentPosition(esdeveniment.id);
                                                setCreate(false);
                                                setNewPositionTag({ nom: esdeveniment.nom, descripcio: esdeveniment.descripcio });
                                                setShowModalPosicions(true);
                                            }
                                        }}>
                                            <FaPencilAlt />
                                        </button>
                                    </td>
                                    <td>
                                        <button onClick={() => {
                                            if (hasWritePermission("colla")) {
                                                deletePosicio(position.id);
                                            }
                                        }}>
                                            <FaTrashAlt />
                                        </button>
                                    </td>
                                </tr >
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EsdevenimentsList;