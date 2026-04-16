import { useState } from "react";
import "./LoginRegistre.css";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    return (
        <div className="login-container">
            <h1>Estàs al dashboard</h1>
            <div>
                <button onClick={() => {
                    navigate("/login");
                }}>ANAR AL LOGIN</button>
            </div>
            <div>
                <button onClick={() => {
                    navigate("/register");
                }}>ANAR AL REGISTER</button>
            </div>
        
        </div>
  );
}

export default Dashboard; 