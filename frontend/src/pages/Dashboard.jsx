import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { getPermissions } from "../utils/utils.jsx"

import { FaPencilAlt, FaUsers, FaRegEye } from "react-icons/fa";

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    //assistencia, colla, esdeveniments, llistats, membres, notificacions, permisos, plantilles, proves
    const permissions = getPermissions();
    const permissionsReady = permissions && Object.keys(permissions).length > 0;
    const hasWritePermission = (key) => permissions[key] === "W";
    const hasReadPermission = (key) => permissions[key] === "R";

    const [futurs, setFuturs] = useState([]);

    const [topMenuReady, setTopMenuReady] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

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

            let result = data;

            if (hasWritePermission("esdeveniments")) {
                result = data.slice(0, 5);

            } else if (hasReadPermission("esdeveniments")) {
                result = data.filter(e => e.visible === true).slice(0, 5);
            } else {
                result = [];
            }

            setFuturs(result);
            console.log("{DEBUG} Get colla's future esdeveniments OK")
        } else {
            console.log("{DEBUG} Get colla's future esdeveniments KO")
            setError(data.message);
        }
    }

    useEffect(() => {
        if (!refreshKey) return;

        getCollesFutureEsdeveniments();
    }, [refreshKey]);

    return (
        <div>
            <TopMenu
                title="Dashboard"
                canvi_colla
                onReady={() => setRefreshKey(prev => prev + 1)}
            />
            <div className="dashboard-grid">
                <div className="left-column-dashboard">
                    <div className="dashboard-grid-esdeveniment">
                        <div className="upper-esdeveniments-part">
                            <span>{futurs.length > 0 ? futurs[0].nom : "No hi ha esdeveniments"}</span>

                            {futurs.length > 0 && (
                                <>
                                    <div className="dashboard-assistencia-ok">OK</div>
                                    <div className="dashboard-assistencia-ko">KO</div>
                                    <div className="dashboard-assistencia-unknown">??</div>

                                    <Button
                                        text="Consultar"
                                        icon={<FaRegEye />}
                                        action={() => {
                                            navigate(`/consult_esdeveniment?idEsdeveniment=${futurs[0].id}`);
                                        }}
                                    />
                                </>
                            )}
                        </div>
                        <hr />
                        <div className="lower-esdeveniments-part">
                            {futurs.length > 0 ? (
                                <>
                                    <Button
                                        text="Assistència"
                                        icon={<FaUsers />}
                                        action={() => {
                                            alert("Funcionalitat encara no implementada.");
                                        }}
                                    />
                                </>
                            ) : (
                                <>
                                    <span>Crea un esdeveniment per modificar l'assistència</span>
                                </>
                            )}

                        </div>
                    </div>
                    <div className="dashboard-grid-proves">

                    </div>
                </div>

                <div className="right-column-dashboard">
                    <div className="dashboard-grid-notificacions">
                    </div>
                    <div className="dashboard-grid-propers-esdeveniments">

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard; 