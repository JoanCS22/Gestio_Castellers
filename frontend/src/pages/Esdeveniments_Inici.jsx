import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaSave, FaTimesCircle, FaPencilAlt, FaPlusSquare, FaSearch, FaRegEye, FaUsers, 
    FaClipboardList, FaUserEdit } from "react-icons/fa";

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
    const hasAccess = (key) => permissions[key] !== "X";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    const [selectedTag, setSelectedTag] = useState("futurs");

    const [futurs, setFuturs] = useState([]);
    const [passats, setPassats] = useState([]);

    const [assaig, setAssaig] = useState(false);
    const [actuacio, setActuacio] = useState(false);
    const [altres, setAltres] = useState(false);
    const [tots, setTots] = useState(true);

    const isFuturs = selectedTag === "futurs";
    const isPassats = selectedTag === "passats";

    const currentEsdeveniments = isFuturs ? futurs : passats;

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    const getCollesPastEsdeveniments = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/esdeveniments/getPastEsdeveniments?id=${idColla}`, {
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
            setPassats(data);
            console.log("{DEBUG} Get colla's past esdeveniments OK")
        } else {
            console.log("{DEBUG} Get colla's past esdeveniments KO")
            setError(data.message);
        }
    }

    const getCollesFutureEsdeveniments = async () => {

        const token = localStorage.getItem("token");
        const idColla = localStorage.getItem("id_colla");

        const response = await fetch(`http://localhost:5000/esdeveniments/getFutureEsdeveniments?id=${idColla}`, {
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
            setFuturs(data);
            console.log("{DEBUG} Get colla's future esdeveniments OK")
        } else {
            console.log("{DEBUG} Get colla's future esdeveniments KO")
            setError(data.message);
        }
    }

    useEffect(() => {
        getCollesFutureEsdeveniments();
        getCollesPastEsdeveniments();
    }, []);

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
                                navigate("/create_esdeveniment");
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
                        <span>Actuació:</span>
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
                                {(esdeveniment.visible || hasWritePermission("esdeveniments")) && (
                                    <>
                                        <tr key={esdeveniment.id}>
                                            <td>{esdeveniment.nom}</td>
                                            <td>{esdeveniment.tipus}</td>
                                            <td>
                                                <div className="date-time-cell-esdeveniments">
                                                    <div className="date-esdeveniments">
                                                        {new Date(esdeveniment.data_esdeveniment).toLocaleDateString("es-ES")}
                                                    </div>
                                                    <div className="time-esdeveniments">
                                                        {esdeveniment.hora}
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="buttons-esdeveniments-list">
                                                    <Button
                                                        text="Consultar"
                                                        icon={<FaRegEye />}
                                                        action={() => {
                                                            navigate(`/consult_esdeveniment?idEsdeveniment=${esdeveniment.id}`);
                                                        }}
                                                    />
                                                    {hasWritePermission("colla") && (
                                                        <>
                                                            <Button
                                                                text="Modificar"
                                                                icon={<FaPencilAlt />}
                                                                action={() => {
                                                                    navigate(`/modify_esdeveniment?idEsdeveniment=${esdeveniment.id}`);
                                                                }}
                                                            />
                                                        </>
                                                    )}
                                                    <Button
                                                        text="Proves"
                                                        icon={<FaClipboardList />}
                                                        action={() => {
                                                            navigate(`/proves?idEsdeveniment=${esdeveniment.id}&nomEsdeveniment=${encodeURIComponent(esdeveniment.nom)}`);
                                                        }}
                                                    />
                                                    {hasWritePermission("assistencia") && (
                                                        <>
                                                        </>
                                                    )}
                                                    <Button
                                                        text="Assistència"
                                                        icon={<FaUserEdit />}
                                                        action={() => {
                                                            if (hasWritePermission("assistencia")) {
                                                                navigate(`/assistencia?idEsdeveniment=${esdeveniment.id}&nomEsdeveniment=${encodeURIComponent(esdeveniment.nom)}`);
                                                            } else if (hasAccess("assistencia")) {
                                                                navigate(`/assistencia_usuari?idEsdeveniment=${esdeveniment.id}`);
                                                            }
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr >
                                    </>
                                )}
                            </>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default EsdevenimentsList;