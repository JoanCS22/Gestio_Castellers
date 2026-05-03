import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from "react-router-dom";

import { FaCaretUp, FaSearch, FaCheckDouble, FaCheck, FaPencilAlt } from "react-icons/fa";

import { getPermissions } from "../utils/utils.jsx"

import './Assistencia_Llistat.css';

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

const LlistatAssistencia = () => {
    const navigate = useNavigate();

    const location = useLocation();

    const params = new URLSearchParams(location.search);
    const idEsdeveniment = params.get("idEsdeveniment");

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasAccess = (key) => permissions[key] !== "X";

    const [message, setTempMessage] = useState(null);
    const [error, setError] = useState("");

    return (
        <div>
            <TopMenu
                title={`Assistència`}
            />

            {
                message && (
                    <div className={`message ${message.type}`}>
                        {message.message}
                    </div>
                )
            }

            <div className="button-section-assistencia-llistat">
                <Button
                    text="La meva assistència"
                    icon={<FaPencilAlt />}
                    action={() => {

                    }}
                />
            </div>

            <div className="filters-llistat-assistencia">
                <div className="search-bar-llistat-assistencia">
                    <span>Cercar:</span>
                    <FaSearch className="search-icon-tags" />
                    <input type='search' placeholder='Cercar...'></input>
                </div>
                <div className="numbers-llistat-assistencia">
                    <div className="dashboard-assistencia-ok">OK</div>
                    <div className="dashboard-assistencia-ko">KO</div>
                    <div className="dashboard-assistencia-unknown">??</div>
                </div>
            </div>

            <div className="table-llistat-assistencia">
                <table>
                    <colgroup>
                        <col style={{ width: "15%" }} />
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "5%" }} />
                        <col style={{ width: "10%" }} />
                        <col style={{ width: "45%" }} />
                        <col style={{ width: "15%" }} />

                    </colgroup>

                    <thead>
                        <tr>
                            <th>Nom</th>
                            <th><FaCheck /></th>
                            <th><FaCheckDouble /></th>
                            <th>Acompanyants</th>
                            <th>Comentari</th>
                            <th>Actualització</th>
                        </tr>
                    </thead>
                    {/* <tbody>
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
                                                        icon={<FaPencilAlt />}
                                                        action={() => {

                                                        }}
                                                    />
                                                    <Button
                                                        text="Assistència"
                                                        icon={<FaClipboardList />}
                                                        action={() => {

                                                        }}
                                                    />
                                                </div>
                                            </td>
                                        </tr >
                                    </>
                                )}
                            </>
                        ))}
                    </tbody> */}
                </table>
            </div>

        </div>
    )
}

export default LlistatAssistencia;