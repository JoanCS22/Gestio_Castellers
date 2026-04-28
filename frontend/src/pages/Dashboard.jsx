import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaPencilAlt, FaUsers } from "react-icons/fa";

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <TopMenu
                title="Dashboard"
                canvi_colla
            />
            <div className="dashboard-grid">
                <div className="dashboard-grid-esdeveniment">
                    <span>NOM PROPER ESDEVENIMENT</span>

                    <div className="dashboard-assistencia-ok">OK</div>
                    <div className="dashboard-assistencia-ko">KO</div>
                    <div className="dashboard-assistencia-notknown">??</div>

                    <Button
                        text="Modificar esdeveniment"
                        icon={<FaPencilAlt />}
                        action={() => {
                            alert("Funcionalitat encara no implementada.");
                        }}
                    />
                    <Button
                        text="Assistència"
                        icon={<FaUsers />}
                        action={() => {
                            alert("Funcionalitat encara no implementada.");
                        }}
                    />
                </div>
                <div className="dashboard-grid-notificacions">

                </div>
                <div className="dashboard-grid-proves">

                </div>
                <div className="dashboard-grid-propers-esdeveniments">

                </div>
            </div>
        </div>
    );
}

export default Dashboard; 