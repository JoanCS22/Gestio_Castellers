import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegistre from "./pages/LoginRegistre";
import Dashboard from "./pages/Dashboard"
import NormalProfile from "./pages/Usuaris_PerfilNormal";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginRegistre />} />
      <Route path="/register" element={<LoginRegistre />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/normal_profile" element={<NormalProfile />} />
    </Routes>
  );
}

export default App;