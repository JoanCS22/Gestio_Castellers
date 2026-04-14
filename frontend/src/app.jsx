import { Routes, Route, Navigate } from "react-router-dom";
import LoginRegistre from "./pages/LoginRegistre";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<LoginRegistre />} />
    </Routes>
  );
}

export default App;