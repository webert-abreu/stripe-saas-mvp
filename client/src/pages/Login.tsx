import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Key,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  HelpCircle,
  ChevronLeft,
} from "lucide-react";
import { toast } from "sonner";

export default function Login() {
  const navigate = useNavigate();
  const [apiKey, setApiKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // 1. Validação Básica
    if (!apiKey.trim()) {
      toast.error("Por favor, cole sua chave da Stripe.");
      setIsLoading(false);
      return;
    }

    if (!apiKey.startsWith("sk_") && !apiKey.startsWith("rk_")) {
      toast.error("Chave inválida. Deve começar com 'sk_' ou 'rk_'.");
      setIsLoading(false);
      return;
    }

    // 2. Simulação de processamento (UX)
    setTimeout(() => {
      // Salva no navegador para usar no App.tsx
      localStorage.setItem("stripe_api_key", apiKey);
      // Salva um e-mail fictício apenas para exibição (em produção, pegaríamos da API)
      localStorage.setItem("stripe_user_email", "conta_conectada@stripe.com");

      toast.success("Chave validada! Entrando...");
      navigate("/app");
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex md:flex-row flex-col font-sans text-slate-200">
      {/* LADO ESQUERDO - Formulário */}
      <div className="flex-1 flex flex-col justify-center p-8 md:p-16 relative">
        <button
          onClick={() => navigate("/")}
          className="absolute top-8 left-8 text-slate-500 hover:text-white flex items-center gap-2 transition-colors text-sm"
        >
          <ChevronLeft className="w-4 h-4" /> Voltar ao site
        </button>

        <div className="max-w-md mx-auto w-full">
          <div className="mb-8">
            <div className="bg-indigo-600/10 w-12 h-12 rounded-xl flex items-center justify-center mb-4 border border-indigo-500/20">
              <Key className="w-6 h-6 text-indigo-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Acesse seu Painel
            </h1>
            <p className="text-slate-400">
              Cole sua chave da Stripe para listar e baixar suas faturas.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300">
                Chave de API (Secret Key)
              </label>
              <div className="relative group">
                <input
                  type={showKey ? "text" : "password"}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="sk_live_..."
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3.5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all font-mono text-sm pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowKey(!showKey)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showKey ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Sua chave é usada apenas em
                memória.
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                "Validando..."
              ) : (
                <>
                  Acessar Sistema <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-900">
            <button
              onClick={() => setShowTutorial(!showTutorial)}
              className="w-full flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div className="bg-slate-800 p-2 rounded-lg group-hover:bg-slate-700 transition-colors">
                  <HelpCircle className="w-4 h-4 text-slate-400" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-200">
                    Onde pego minha chave?
                  </p>
                  <p className="text-xs text-slate-500">
                    Guia rápido de 30 segundos
                  </p>
                </div>
              </div>
              <ArrowRight
                className={`w-4 h-4 text-slate-500 transition-transform ${showTutorial ? "rotate-90" : ""}`}
              />
            </button>

            {/* Substitua o bloco do showTutorial por este: */}
            {showTutorial && (
              <div className="mt-4 bg-slate-900/30 rounded-xl p-4 border border-slate-800/50 space-y-3 text-sm text-slate-400 animate-in slide-in-from-top-2">
                <div className="flex items-start gap-3">
                  <span className="bg-indigo-500/20 text-indigo-400 font-bold px-2 py-0.5 rounded text-xs mt-0.5">
                    DICA
                  </span>
                  <p>
                    Para sua segurança, recomendamos criar uma{" "}
                    <strong>Chave Restrita</strong> (Restricted Key) com
                    permissão apenas de "Leitura".
                  </p>
                </div>

                <hr className="border-slate-800/50" />

                <ol className="list-decimal list-inside space-y-2 marker:text-indigo-500">
                  <li>
                    Acesse o painel{" "}
                    <a
                      href="https://dashboard.stripe.com/apikeys"
                      target="_blank"
                      className="text-indigo-400 hover:underline hover:text-indigo-300 transition-colors"
                    >
                      Developers da Stripe
                    </a>
                    .
                  </li>
                  <li>
                    Clique em <strong>"Criar chave restrita"</strong>.
                  </li>
                  <li>
                    Dê o nome de "StripeSaaS" e selecione{" "}
                    <strong>"Read"</strong> (Leitura) em Invoices/Faturas.
                  </li>
                  <li>
                    Copie a chave que começa com <code>rk_live_...</code> e cole
                    acima.
                  </li>
                </ol>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* LADO DIREITO - Banner (Visível só em Desktop) */}
      <div className="hidden md:flex flex-1 bg-gradient-to-br from-indigo-900 to-slate-900 relative overflow-hidden items-center justify-center p-12">
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px]"></div>

        <div className="relative z-10 max-w-lg">
          <div className="bg-slate-950/50 backdrop-blur-xl border border-slate-800 p-8 rounded-3xl shadow-2xl">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-3 w-3 rounded-full bg-red-500"></div>
              <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
              <div className="h-3 w-3 rounded-full bg-green-500"></div>
            </div>
            <div className="space-y-4 font-mono text-sm">
              <div className="flex justify-between text-slate-500">
                <span>fatura_cliente_01.pdf</span>
                <span className="text-emerald-500">Baixado</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>fatura_cliente_02.pdf</span>
                <span className="text-emerald-500">Baixado</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>relatorio_mensal.zip</span>
                <span className="text-indigo-400 animate-pulse">
                  Gerando...
                </span>
              </div>
              <div className="h-2 bg-slate-800 rounded-full mt-4 overflow-hidden">
                <div className="h-full bg-indigo-500 w-2/3"></div>
              </div>
            </div>
          </div>
          <div className="mt-8 text-center">
            <h2 className="text-2xl font-bold text-white mb-2">
              Automotize sua rotina
            </h2>
            <p className="text-indigo-200">
              Junte-se a centenas de empresas que economizam horas de
              contabilidade todo mês.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
