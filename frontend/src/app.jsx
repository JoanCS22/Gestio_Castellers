import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegistre from "./pages/LoginRegistre";
import Dashboard from "./pages/Dashboard"
import NormalProfile from "./pages/Usuaris_PerfilNormal";
import CollaInfo from "./pages/Colla_Info";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginRegistre />} />
      <Route path="/register" element={<LoginRegistre />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/normal_profile" element={<NormalProfile />} />
      <Route path="/create_colla" element={<CollaInfo />} />
      <Route path="/modify_info_colla" element={<CollaInfo />} />
      <Route path="/see_info_colla" element={<CollaInfo />} />
      <Route path="/get_data_colla" element={<CollaInfo />} />
    </Routes>
  );
}

export default App;