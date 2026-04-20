import { useState } from "react";
import { useNavigate } from "react-router-dom";

import TopMenu from "../components/TopMenu";

import "./Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <TopMenu
                title="Dashboard"
                canvi_colla
            />

            <div>
                DASHBOARD
            </div>
        </div>
    );
}

export default Dashboard; 