
import { Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/login/login.js";
import Conta from "../pages/conta/conta.js";

export default function RoutesOpen() {
  return (
    <Routes>
      <Route path="/conta" element={<Conta />} />
      <Route path="/login" element={<Login />} />
      
      {/* qualquer rota pública desconhecida redireciona para login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
}