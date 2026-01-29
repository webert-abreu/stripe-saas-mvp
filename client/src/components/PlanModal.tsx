import { X, CheckCircle2, Zap } from "lucide-react";

interface PlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
}

export default function PlanModal({ isOpen, onClose }: PlanModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-3xl p-8 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-slate-500 hover:text-white transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="bg-indigo-600 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/30">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">
            Limite Atingido
          </h2>
          <p className="text-slate-400 text-sm">
            Libere downloads ilimitados agora.
          </p>
        </div>

        {/* --- CARTÃO DE PREÇO (R$ 49,90) --- */}
        <div className="bg-gradient-to-b from-slate-800 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h3 className="text-white font-bold text-lg">PRO Mensal</h3>
              <p className="text-indigo-400 text-xs">Cancele quando quiser</p>
            </div>
            <div className="text-right">
              <span className="text-3xl font-bold text-white">R$ 49,90</span>
              <span className="text-slate-400 text-xs font-medium ml-1">
                /mês
              </span>
            </div>
          </div>

          <ul className="space-y-3 mb-6">
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Downloads
              Ilimitados
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Acesso
              Imediato
            </li>
            <li className="flex items-center gap-2 text-sm text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-indigo-500" /> Suporte
              Prioritário
            </li>
          </ul>

          {/* --- AQUI ESTÁ O SEU LINK NOVO --- */}
          <a
            href="https://buy.stripe.com/4gM28q4QQ9lp8uF54rgEg00"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-500/25 flex items-center justify-center gap-2 active:scale-95 text-center block"
          >
            Assinar Plano Mensal
          </a>
        </div>

        <p className="text-center text-[10px] text-slate-600">
          Pagamento processado seguramente via Stripe.
        </p>
      </div>
    </div>
  );
}
