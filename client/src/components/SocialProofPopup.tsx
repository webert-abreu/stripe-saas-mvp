"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, X } from "lucide-react";

// DADOS FICTÍCIOS (Pode alterar os nomes se quiser)
const RECENT_SALES = [
  { name: "Ricardo M.", location: "São Paulo", time: "há 2 min" },
  { name: "Fernanda L.", location: "Rio de Janeiro", time: "há 12 min" },
  { name: "Agência V4", location: "Belo Horizonte", time: "há 30 min" },
  { name: "João Paulo", location: "Curitiba", time: "há 5 min" },
  {
    name: "StartBooks Contabilidade",
    location: "Florianópolis",
    time: "há 1 hora",
  },
  { name: "Pedro S.", location: "Porto Alegre", time: "há 15 min" },
];

export function SocialProofPopup() {
  // CONFIGURAÇÃO:
  // true = Aparece assim que carrega (bom para testar agora)
  // false = Espera o tempo do setTimeout abaixo
  const [isVisible, setIsVisible] = useState(true);
  const [currentSale, setCurrentSale] = useState(RECENT_SALES[0]);

  useEffect(() => {
    // --- Para produção: Descomente a linha abaixo para esperar 3 segs antes de aparecer ---
    // const initialDelay = setTimeout(() => setIsVisible(true), 3000);

    const cycleInterval = setInterval(() => {
      setIsVisible(false); // Esconde

      // Espera a animação de saída terminar (0.5s) para trocar os dados e mostrar de novo
      setTimeout(() => {
        const randomSale =
          RECENT_SALES[Math.floor(Math.random() * RECENT_SALES.length)];
        setCurrentSale(randomSale);
        setIsVisible(true);
      }, 500);
    }, 10000); // Troca a cada 10 segundos

    return () => {
      // clearTimeout(initialDelay);
      clearInterval(cycleInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", damping: 20, stiffness: 300 }}
          className="fixed bottom-4 left-4 z-50 w-auto max-w-[340px]"
        >
          {/* CARD PRINCIPAL COM EFEITO DE VIDRO (GLASSMORPHISM) */}
          <div className="group relative flex flex-col gap-2 rounded-2xl border border-zinc-200/60 bg-white/90 p-4 shadow-xl backdrop-blur-md transition-all hover:shadow-2xl dark:border-zinc-800/60 dark:bg-zinc-900/90 dark:shadow-black/50">
            {/* Botão de Fechar (Só aparece ao passar o mouse) */}
            <button
              onClick={() => setIsVisible(false)}
              className="absolute right-2 top-2 rounded-full p-1 text-zinc-300 opacity-0 transition-opacity hover:bg-zinc-100 hover:text-zinc-600 group-hover:opacity-100 dark:hover:bg-zinc-800 dark:hover:text-zinc-400"
            >
              <X className="h-3.5 w-3.5" />
            </button>

            {/* Texto: Quem comprou */}
            <div className="space-y-0.5 pr-4">
              <p className="text-[13px] font-medium text-zinc-800 dark:text-zinc-200">
                {currentSale.name}{" "}
                <span className="text-zinc-400 font-normal">
                  de {currentSale.location}
                </span>
              </p>

              <p className="text-[13px] text-zinc-600 dark:text-zinc-400 leading-tight">
                Acabou de assinar o{" "}
                <strong className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text font-bold text-transparent">
                  Plano Pro
                </strong>
                .
              </p>
            </div>

            {/* Selo de Verificação (Pílula Verde) */}
            <div className="flex items-center gap-2 mt-1">
              <div className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-600 border border-emerald-500/20 dark:bg-emerald-500/20 dark:text-emerald-400">
                <CheckCircle2 className="h-3 w-3" />
                VERIFICADO PELA STRIPE
              </div>
              <span className="text-[10px] font-medium text-zinc-400">
                • {currentSale.time}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
