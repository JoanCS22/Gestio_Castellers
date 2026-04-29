import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { FaPencilAlt, FaUsers } from "react-icons/fa";

import TopMenu from "../components/TopMenu";
import Button from "../components/Button";

import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    const [existsEvent, setExistsEvent] = useState(true);

    return (
        <div>
            <TopMenu
                title="Dashboard"
                canvi_colla
            />
            <div className="dashboard-grid">
                <div className="left-column-dashboard">
                    <div className="dashboard-grid-esdeveniment">
                        <div className="upper-esdeveniments-part">
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
                        <div className="lower-esdeveniments-part">

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