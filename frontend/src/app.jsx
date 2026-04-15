import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegistre from "./pages/LoginRegistre";
import Dashboard from "./pages/Dashboard"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginRegistre />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;