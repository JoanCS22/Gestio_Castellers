import { register, login } from "../services/authService.js";
import { handleApiError } from "../utils/handleApiError.js";

import "./LoginRegistre.css";
import Input from "../components/Input.jsx";

import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import { FaLock, FaRegEnvelope, FaEye, FaEyeSlash, FaUsers } from "react-icons/fa";

function LoginRegistre() {
    const navigate = useNavigate();
    const location = useLocation();
    const isLogin = location.pathname === "/login";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [message, setTempMessage] = useState(null);

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasLetter = /[A-Za-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>_-]/.test(password);
        return minLength && hasLetter && hasNumber && hasSpecial;
    };

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const showTempMessage = (message, type = "success") => {
        setTempMessage({ message, type });
        setTimeout(() => setTempMessage(null), 2000);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const data = await login(email, password);
                setError("");
                localStorage.clear();
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                showTempMessage("Iniciant sessió...");
                setTimeout(() => navigate("/dashboard"), 2000);
            } else {
                if (!validatePassword(password)) {
                    setError("La contrasenya ha de tenir mínim 8 caràcters, una lletra, un número i un símbol");
                    return;
                }
                if (!validateEmail(email)) {
                    setError("El correu electrònic no té un format vàlid");
                    return;
                }
                const data = await register(email, password);
                showTempMessage("Usuari creat correctament.");
                setEmail("");
                setPassword("");
                navigate("/login");
            }
        } catch (err) {
            handleApiError(err, navigate, setError);
        }
    };

    return (
        <div className="login-container">

            {/* Toast notification */}
            {message && (
                <div className={`message ${message.type}`}>
                    {message.message}
                </div>
            )}

            {/* Branding */}
            <div className="login-branding">
                <div className="login-logo">
                    <FaUsers  className="material-symbols-outlined"/>
                </div>
                <h1 className="login-app-title">La Plaça</h1>
                <p className="login-app-subtitle">Gestió de pinyes i castells</p>
            </div>

            <div className="login-card">
                <form onSubmit={handleSubmit}>
                    <div className="field-group">
                        <label className="field-label" htmlFor="email">
                            Correu electrònic
                        </label>
                        <div className="field-input-wrap">
                            <FaRegEnvelope className="material-symbols-outlined field-icon" aria-hidden="true"/>
                            <input
                                id="email"
                                type="email"
                                placeholder="usuari@collacastellera.cat"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label className="field-label" htmlFor="password">
                            Contrasenya
                        </label>
                        <div className="field-input-wrap">
                            <FaLock className="material-symbols-outlined field-icon" aria-hidden="true"/>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingRight: "44px" }}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label={showPassword ? "Amaga la contrasenya" : "Mostra la contrasenya"}
                            >
                                <span className="material-symbols-outlined">
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </span>
                            </button>
                        </div>
                    </div>

                    {isLogin && (
                        <div className="forgot-link-row">
                            <a href="#" className="forgot-link">
                                Has oblidat la contrasenya?
                            </a>
                        </div>
                    )}

                    <button type="submit" className="btn-primary">
                        {isLogin ? "Iniciar sessió" : "Crear compte"}
                    </button>
                </form>

                <div className="divider">
                    <span className="divider-label">
                        {isLogin ? "Ets nou a la colla?" : "Ja tens compte?"}
                    </span>
                </div>

                <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => {
                        navigate(isLogin ? "/register" : "/login");
                        setEmail("");
                        setPassword("");
                        setError("");
                    }}
                >
                    {isLogin ? "Enregistra't" : "Inicia sessió"}
                </button>

                {error && (
                    <div className="error-message" role="alert" style={{ marginTop: "16px" }}>
                        {error}
                    </div>
                )}
            </div>

            <footer className="login-footer">
                <p>© 2024 CastellersHub · Desenvolupat per a la comunitat castellera</p>
                <div className="login-footer-links">
                    <a href="#">Privacitat</a>
                    <a href="#">Suport</a>
                </div>
            </footer>

        </div>
    );
}

export default LoginRegistre;