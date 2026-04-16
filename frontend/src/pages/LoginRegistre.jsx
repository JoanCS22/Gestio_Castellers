import "./LoginRegistre.css";
import Input from "../components/Input";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

function LoginRegistre() {
    const navigate = useNavigate();

    const location = useLocation();
    const isLogin = location.pathname === "/login";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        return minLength && hasLetter && hasNumber && hasSpecial;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!validatePassword(password)) {
            setError("La contrasenya ha de tenir mínim 8 caràcters, una lletra, un número i un símbol");
            return;
        }

        if (isLogin) {
            console.log("{DEBUG} LOGIN");


            // TODO: Crides al backend
        } else {
            console.log("{INFO} REGISTRE");

            try {
                const response = await fetch("http://localhost:5000/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email,
                        contrasenya: password,
                    }),
                });

                const data = await response.json();

                if (response.ok) {
                    console.log("{INFO} Usuari creat:", data);
                    navigate("/dashboard");
                } else {
                    setError(data.message || "Error desconocido");
                }
            } catch (error) {
                console.error("{INFO} Error de connexió:", error);
            }
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">

                <h2>{isLogin ? "Iniciar sesió" : "Registrar-se"}</h2>

                <form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        placeholder="Correu electrònic"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <Input
                        type="password"
                        placeholder="Contrasenya"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit">
                        {isLogin ? "Entrar a l'aplicació" : "Crear compte"}
                    </button>
                </form>

                <p className="register-text">
                    {isLogin ? "No tens compte?" : "Ja tens compte?"}{" "}
                    <span onClick={
                        () => {
                            navigate(isLogin ? "/register" : "/login");
                            setEmail("");
                            setPassword("");
                        }}>
                        {isLogin ? "Enregistra't" : "Inicia sessió"}
                    </span>
                </p>
                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

            </div>
        </div>
    );
}

export default LoginRegistre;