import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importando as páginas
import App from "./App";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

// CSS Global
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        {/* ROTA 1: A Vitrine (Pública) - É aqui que o usuário cai ao digitar o site */}
        <Route path="/" element={<Landing />} />

        {/* ROTA 2: O Login (Entrada) */}
        <Route path="/login" element={<Login />} />

        {/* ROTA 3: O Sistema (Privado) - Onde acontece o download */}
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
