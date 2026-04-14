import { useState } from "react";
import "./LoginRegistre.css";

function LoginRegistre() {
  const [isLogin, setIsLogin] = useState(true); // 👈 modo actual
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isLogin) {
      // 🔐 LOGIN
        console.log("LOGIN");
        console.log(email, password);

        // TODO: Crides al backend

    } else {
        console.log("REGISTRE");
        console.log(email, password);

        // TODO: Crides al backend

    }
  };

  return (
    <div className="login-container">
        <div className="login-card">
        
            <h2>{isLogin ? "Iniciar sesió" : "Registrar-se"}</h2>

            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Correu electrònic"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input
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
                    () => {setIsLogin(!isLogin)
                    setEmail("");
                    setPassword("");
                }}>
                    {isLogin ? "Enregistra't" : "Inicia sessió"}
                </span>
            </p>

      </div>
    </div>
  );
}

export default LoginRegistre;