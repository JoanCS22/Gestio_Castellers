import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Input from "../components/Input";
import TopMenu from "../components/TopMenu";

import "./LoginRegistre.css";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div>
            <TopMenu/>

            <div>
                HOLA
            </div>
        </div>
    );
}

export default Dashboard; 