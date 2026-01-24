import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Download,
  ArrowUpRight,
  Search,
  Filter,
  LogOut,
  User,
  ShieldCheck,
  Zap,
  Activity,
  CalendarRange,
  Wifi,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import PlanModal from "./components/PlanModal";

// URL do Backend
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
  customer: string;
  invoice_pdf: string | null;
}

export default function App() {
  const navigate = useNavigate();
  const userEmail =
    localStorage.getItem("stripe_user_email") ||
    sessionStorage.getItem("stripe_user_email");

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [ping, setPing] = useState(24);

  // Estado para guardar o ID de quem foi bloqueado
  const [userIdToUpgrade, setUserIdToUpgrade] = useState("");

  const [showPaywall, setShowPaywall] = useState(false);

  useEffect(() => {
    const interval = setInterval(
      () => setPing(Math.floor(Math.random() * (45 - 18 + 1) + 18)),
      3000,
    );
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("stripe_api_key");
    localStorage.removeItem("stripe_user_email");
    sessionStorage.removeItem("stripe_api_key");
    sessionStorage.removeItem("stripe_user_email");
    toast.info("Sessão encerrada.");
    navigate("/");
  };

  const handleFetchInvoices = useCallback(
    (key: string) => {
      setIsLoading(true);
      const loadingToast = toast.loading("Sincronizando...");

      const params = new URLSearchParams();
      if (startDate) params.append("startDate", startDate);
      if (endDate) params.append("endDate", endDate);

      fetch(`${API_URL}/api/invoices?${params.toString()}`, {
        headers: { "x-stripe-key": key },
      })
        .then((res) => {
          if (!res.ok) throw new Error();
          return res.json();
        })
        .then((data) => {
          setInvoices(data);
          setIsLoading(false);
          toast.dismiss(loadingToast);
          if (data.length > 0)
            toast.success(`${data.length} notas encontradas.`);
        })
        .catch((error) => {
          console.error(error);
          toast.dismiss(loadingToast);
          toast.error("Erro de conexão com o servidor.");
          setIsLoading(false);
        });
    },
    [startDate, endDate],
  );

  useEffect(() => {
    const key =
      localStorage.getItem("stripe_api_key") ||
      sessionStorage.getItem("stripe_api_key");
    if (key) {
      handleFetchInvoices(key);
    } else {
      navigate("/login");
    }
  }, [handleFetchInvoices, navigate]);

  const setQuickDate = (type: "last30" | "lastMonth" | "year") => {
    const today = new Date();
    const start = new Date();
    if (type === "last30") start.setDate(today.getDate() - 30);
    else if (type === "lastMonth") {
      start.setMonth(today.getMonth() - 1);
      start.setDate(1);
      today.setDate(0);
    } else if (type === "year") start.setMonth(0, 1);

    setStartDate(start.toISOString().split("T")[0]);
    setEndDate(today.toISOString().split("T")[0]);
    toast.info("Período atualizado.");
  };

  const handleDownloadZip = async () => {
    const key =
      localStorage.getItem("stripe_api_key") ||
      sessionStorage.getItem("stripe_api_key");
    if (!key) return;

    const params = new URLSearchParams();
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);

    const toastId = toast.loading("Processando download...");

    try {
      const response = await fetch(
        `${API_URL}/api/download-all?${params.toString()}`,
        { headers: { "x-stripe-key": key } },
      );

      // --- LÓGICA DO BLOQUEIO (403) ---
      if (response.status === 403) {
        const data = await response.json();

        // Agora essa variável existe e não vai dar erro!
        setUserIdToUpgrade(data.stripeAccountId);

        toast.dismiss(toastId);
        toast.error("Limite gratuito atingido!");
        setShowPaywall(true); // Abre o modal
        return;
      }

      if (!response.ok) throw new Error();

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "faturas_filtradas.zip";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);

      toast.dismiss(toastId);
      toast.success("Download iniciado! 📂");
    } catch (err) {
      console.error(err);
      toast.dismiss(toastId);
      // Só mostra erro se não for o bloqueio (que já tratamos acima)
      if (!showPaywall) toast.error("Falha ao processar download.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 text-sm pb-12">
      <Toaster richColors position="top-center" theme="dark" />

      {/* Passamos o ID bloqueado para o Modal criar o link de pagamento certo */}
      <PlanModal
        isOpen={showPaywall}
        onClose={() => setShowPaywall(false)}
        userId={userIdToUpgrade}
      />

      <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-800 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              {/* --- AQUI ESTAVA O NOME ANTIGO, AGORA ESTÁ ATUALIZADO --- */}
              <span className="font-bold text-base text-white tracking-tight block leading-none">
                GestorDeFaturas
              </span>
              <span className="text-[10px] text-slate-500 font-medium">
                Enterprise Edition
              </span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="text-xs text-slate-400 hover:text-white font-medium transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-800"
          >
            Sair <LogOut className="w-3 h-3" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* WIDGETS DE STATUS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <User className="w-24 h-24 text-indigo-500" />
            </div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                {userEmail?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white font-bold text-sm">
                  Conta Conectada
                </h3>
                <p className="text-slate-400 text-xs truncate max-w-[150px]">
                  {userEmail}
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-500/10 text-indigo-400 text-[10px] font-bold border border-indigo-500/20">
                <ShieldCheck className="w-3 h-3" /> Admin
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-bold border border-emerald-500/20">
                Ativo
              </span>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <Activity className="w-24 h-24 text-emerald-500" />
            </div>
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2">
              <Wifi className="w-3 h-3 text-emerald-500" /> Status da API
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Conexão Stripe</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>{" "}
                  Online
                </span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300">Latência</span>
                <span className="text-slate-400 font-mono">{ping}ms</span>
              </div>
              <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[98%]"></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden flex flex-col justify-between">
            <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
              <CalendarRange className="w-3 h-3 text-indigo-400" /> Filtros
              Rápidos
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setQuickDate("last30")}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium py-2 rounded-lg transition-colors border border-slate-700"
              >
                Últimos 30 dias
              </button>
              <button
                onClick={() => setQuickDate("lastMonth")}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium py-2 rounded-lg transition-colors border border-slate-700"
              >
                Mês Passado
              </button>
              <button
                onClick={() => setQuickDate("year")}
                className="col-span-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-[10px] font-medium py-2 rounded-lg transition-colors border border-slate-700"
              >
                Este Ano (Jan - Hoje)
              </button>
            </div>
          </div>
        </div>

        {/* ÁREA DE DOWNLOAD */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-900/50 p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex flex-col md:flex-row justify-between items-end gap-6">
            <div className="space-y-1">
              <h1 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" /> Faturas &
                Recibos
              </h1>
              <p className="text-slate-400 text-xs max-w-md">
                Defina o período fiscal e gere o arquivo ZIP para contabilidade.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <div className="flex items-center bg-slate-950 border border-slate-700 rounded-lg p-1 w-full sm:w-auto shadow-sm">
                <div className="px-3 border-r border-slate-800 flex flex-col justify-center text-slate-500">
                  <Filter className="w-3 h-3" />
                </div>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="bg-transparent text-white text-xs p-2.5 outline-none [color-scheme:dark] w-full sm:w-auto"
                />
                <span className="text-slate-700 px-1">à</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="bg-transparent text-white text-xs p-2.5 outline-none [color-scheme:dark] w-full sm:w-auto"
                />
              </div>
              <button
                onClick={handleDownloadZip}
                className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 h-[42px] whitespace-nowrap"
              >
                <Download className="w-4 h-4" /> Baixar ZIP ({invoices.length})
              </button>
            </div>
          </div>
        </div>

        {/* TABELA */}
        {isLoading ? (
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-12 text-center animate-pulse">
            <div className="w-12 h-12 bg-slate-800 rounded-full mx-auto mb-4"></div>
            <div className="h-4 bg-slate-800 w-1/4 mx-auto rounded"></div>
          </div>
        ) : (
          <div className="bg-slate-900 rounded-xl shadow-lg border border-slate-800/80 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Search className="w-3 h-3" /> Histórico
              </span>
              <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-1 rounded-full border border-slate-700">
                {invoices.length} docs
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-950/30 border-b border-slate-800 text-slate-500 text-[10px] uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3 w-1/3">Cliente</th>
                    <th className="px-6 py-3">Emissão</th>
                    <th className="px-6 py-3">Valor</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-center">Arquivo</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {invoices.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-12 text-center text-slate-500 text-xs"
                      >
                        Nenhuma fatura encontrada.
                      </td>
                    </tr>
                  ) : (
                    invoices.map((inv) => (
                      <tr
                        key={inv.id}
                        className="hover:bg-slate-800/50 transition-colors group"
                      >
                        <td className="px-6 py-3.5">
                          <div className="font-medium text-slate-200 text-xs">
                            {inv.customer}
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-slate-400 text-xs">
                          {inv.date}
                        </td>
                        <td className="px-6 py-3.5 font-mono text-slate-300 text-xs">
                          {inv.amount}
                        </td>
                        <td className="px-6 py-3.5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium border ${inv.status === "Pago" ? "bg-emerald-500/5 text-emerald-400 border-emerald-500/20" : "bg-slate-800 text-slate-400 border-slate-700"}`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          {inv.invoice_pdf ? (
                            <a
                              href={inv.invoice_pdf}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-slate-400 hover:text-indigo-400 text-xs font-medium inline-flex items-center gap-1 transition-colors"
                            >
                              PDF <ArrowUpRight className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-slate-700 text-[10px]">
                              -
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
