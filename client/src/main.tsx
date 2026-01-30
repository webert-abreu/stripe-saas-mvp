import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";

// Importando as páginas
import App from "./App";
import Landing from "./pages/Landing";
import Login from "./pages/Login";

// 1. IMPORTANTE: Importe o Popup aqui
import { SocialProofPopup } from "./components/SocialProofPopup";

// CSS Global
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* Avisos do sistema */}
    <Toaster position="top-center" richColors />

    {/* 2. IMPORTANTE: Adicione o Popup aqui para aparecer em TODAS as telas */}
    <SocialProofPopup />

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
