import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner"; // <--- 1. ADICIONE ISSO AQUI

// Importando as páginas
import App from "./App";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

// CSS Global
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 2. ADICIONE ISSO AQUI PARA OS AVISOS APARECEREM */}
    <Toaster position="top-center" richColors />

    <BrowserRouter>
      <Routes>
        {/* ROTA 1: A Vitrine (Pública) */}
        <Route path="/" element={<Landing />} />

        {/* ROTA 2: O Login (Entrada) */}
        <Route path="/login" element={<Login />} />

        {/* ROTA 3: O Sistema (Privado) */}
        <Route path="/app" element={<App />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
