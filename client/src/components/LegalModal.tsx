import { X } from "lucide-react";

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  content: React.ReactNode;
}

export default function LegalModal({
  isOpen,
  onClose,
  title,
  content,
}: LegalModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[80vh]">
        {/* Cabeçalho */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors p-1 hover:bg-slate-800 rounded-lg"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo com Scroll */}
        <div className="p-6 overflow-y-auto text-slate-300 space-y-4 text-sm leading-relaxed">
          {content}
        </div>

        {/* Rodapé do Modal */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/50 rounded-b-2xl flex justify-end">
          <button
            onClick={onClose}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Entendi
          </button>
        </div>
      </div>
    </div>
  );
}
