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
            />

            <div>
                DASHBOARD
            </div>
        </div>
    );
}

export default Dashboard; 