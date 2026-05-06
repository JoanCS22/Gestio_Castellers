import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegistre from "./pages/LoginRegistre";
import Dashboard from "./pages/Dashboard"
import UserProfile from "./pages/Usuaris_Perfil";
import CollaInfo from "./pages/Colla_Info";
import Etiquetes from "./pages/Etiquetes_Inici";
import MembresColla from "./pages/Colla_Membres";
import EsdevenimentsList from "./pages/Esdeveniments_Inici";
import EsdevenimentsInfo from "./pages/Esdeveniments_Info";
import LlistatAssistencia from "./pages/Assistencia_Llistat";
import AssistenciaUsuari from "./pages/Assistencia_Usuari"
import PlantillesList from "./pages/Plantilles_Inici"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<LoginRegistre />} />
      <Route path="/register" element={<LoginRegistre />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/normal_profile" element={<UserProfile />} />
      <Route path="/tecnica_profile" element={<UserProfile />} />

      <Route path="/create_colla" element={<CollaInfo />} />
      <Route path="/modify_info_colla" element={<CollaInfo />} />
      <Route path="/get_data_colla" element={<CollaInfo />} />

      <Route path="/etiquetes" element={<Etiquetes />} />
      <Route path="/rols" element={<Etiquetes />} />

      <Route path="/members" element={<MembresColla />} />

      <Route path="/esdeveniments" element={<EsdevenimentsList />} />

      <Route path="/modify_esdeveniment" element={<EsdevenimentsInfo />} />
      <Route path="/consult_esdeveniment" element={<EsdevenimentsInfo />} />
      <Route path="/create_esdeveniment" element={<EsdevenimentsInfo />} />

      <Route path="/assistencia" element={<LlistatAssistencia />} />
      <Route path="/assistencia_usuari" element={<AssistenciaUsuari />} />

      <Route path="/plantilles" element={<PlantillesList />} />

    </Routes>
  );
}

export default App;