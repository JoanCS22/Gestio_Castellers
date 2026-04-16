import { useState } from "react";
import "./LoginRegistre.css";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

function Dashboard() {
    const navigate = useNavigate();

    const [message, setTempMessage] = useState(null);

    const logoutApp = () => {
        localStorage.clear();
        
        showTempMessage("Tancant sessió...");

        setTimeout(() => {
            navigate("/login");
        }, 2000);
    };

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });

        setTimeout(() => {
            setTempMessage(null);
        }, 2000);
    };

    return (
        <div className="login-container">
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}
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
            <div>
                <button onClick={logoutApp}>
                    Tancar sessió
                </button>
            </div>

        </div>
    );
}

export default Dashboard; 