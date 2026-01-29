import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Download,
  FileText,
  Clock,
  ChevronDown,
  ChevronUp,
  Lock,
} from "lucide-react";
import logoSite from "../assets/logo-site1.png";
import LegalModal from "../components/LegalModal";

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // ESTADOS DOS MODAIS
  const [modalType, setModalType] = useState<"terms" | "privacy" | null>(null);

  // CONTEÚDO DOS TERMOS
  const termsText = (
    <>
      <p>
        <strong>1. Aceitação dos Termos:</strong> Ao utilizar o Gestor de
        Faturas, você concorda com estes termos. O serviço é fornecido "como
        está".
      </p>
      <p>
        <strong>2. Uso do Serviço:</strong> Nossa ferramenta atua apenas como um
        facilitador para download de faturas da Stripe. Não armazenamos seus
        dados bancários sensíveis.
      </p>
      <p>
        <strong>3. Responsabilidade:</strong> Não nos responsabilizamos por
        falhas na API da Stripe ou por uso indevido dos arquivos baixados.
      </p>
      <p>
        <strong>4. Pagamentos:</strong> O serviço pode oferecer planos gratuitos
        e pagos. Assinaturas podem ser canceladas a qualquer momento.
      </p>
    </>
  );

  const privacyText = (
    <>
      <p>
        <strong>1. Coleta de Dados:</strong> Coletamos apenas seu e-mail e ID da
        conta Stripe para autenticação e funcionamento do sistema.
      </p>
      <p>
        <strong>2. Segurança:</strong> Utilizamos criptografia e não temos
        acesso direto ao seu saldo ou capacidade de movimentar fundos.
      </p>
      <p>
        <strong>3. Compartilhamento:</strong> Seus dados nunca serão vendidos a
        terceiros. Eles são usados estritamente para o funcionamento do SaaS.
      </p>
      <p>
        <strong>4. Cookies:</strong> Utilizamos cookies essenciais para manter
        sua sessão ativa.
      </p>
    </>
  );

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200 selection:bg-indigo-500/30">
      {/* --- RENDERIZAÇÃO DOS MODAIS (FALTAVA ISSO) --- */}
      <LegalModal
        isOpen={modalType === "terms"}
        onClose={() => setModalType(null)}
        title="Termos de Uso"
        content={termsText}
      />

      <LegalModal
        isOpen={modalType === "privacy"}
        onClose={() => setModalType(null)}
        title="Política de Privacidade"
        content={privacyText}
      />

      {/* --- 1. NAVBAR (Fixo) --- */}
      <nav className="fixed w-full z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <div
            className="flex items-center gap-2 font-bold text-xl text-white tracking-tight cursor-pointer"
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              src={logoSite}
              alt="Gestor de Faturas"
              className="w-8 h-8 rounded-lg"
            />
            Gestor De Faturas
          </div>
          <div className="flex items-center gap-6">
            <a
              href="#pricing"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              Preços
            </a>
            <a
              href="#features"
              className="text-sm font-medium text-slate-400 hover:text-white transition-colors hidden sm:block"
            >
              Funcionalidades
            </a>
            <button
              onClick={() => navigate("/login")}
              className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-all border border-slate-700"
            >
              Entrar
            </button>
          </div>
        </div>
      </nav>

      {/* --- 2. HERO SECTION (A Promessa) --- */}
      <section className="pt-32 pb-20 px-6 text-center relative overflow-hidden">
        {/* Efeito de fundo */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -z-10"></div>

        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Novo: Exportação Automática para Contabilidade
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight leading-tight">
            Pare de baixar faturas <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
              uma por uma.
            </span>
          </h1>

          <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
            Conecte sua conta Stripe e baixe todas as suas notas fiscais e
            recibos em um único arquivo ZIP. Organizado por data e pronto para
            seu contador.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => navigate("/login")}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-8 py-4 rounded-xl font-bold text-lg flex items-center gap-2 transition-all shadow-xl shadow-indigo-500/20 hover:scale-105 active:scale-95"
            >
              Começar Grátis <ArrowRight className="w-5 h-5" />
            </button>
            <p className="text-xs text-slate-500 mt-2 sm:mt-0">
              <ShieldCheck className="w-3 h-3 inline mr-1" />
              Dados processados em memória. Zero armazenamento.
            </p>
          </div>
        </div>
      </section>

      {/* --- 3. SOCIAL PROOF (Marcas) --- */}
      <section className="py-10 border-y border-slate-800/50 bg-slate-900/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-6">
            Ferramenta essencial para
          </p>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Logos Fictícios de Exemplo */}
            <span className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full"></div> TechStart
            </span>
            <span className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md"></div> DevHouse
            </span>
            <span className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-full"></div> IndieCorp
            </span>
            <span className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-6 h-6 bg-white rounded-md"></div> SaaSify
            </span>
          </div>
        </div>
      </section>

      {/* --- 4. PROBLEM vs SOLUTION (A Dor) --- */}
      <section className="py-24 bg-slate-950">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              A contabilidade mensal não precisa ser um pesadelo.
            </h2>
            <p className="text-slate-400 mb-6 text-lg">
              Você sabe como é: chega o fim do mês, o contador pede as notas, e
              você precisa entrar no Dashboard da Stripe, abrir cada venda,
              clicar em "Baixar PDF", renomear...
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-300">
                <div className="bg-red-500/10 p-1 rounded text-red-400 mt-1">
                  <Clock className="w-4 h-4" />
                </div>
                <span>Horas perdidas com trabalho manual repetitivo.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <div className="bg-red-500/10 p-1 rounded text-red-400 mt-1">
                  <FileText className="w-4 h-4" />
                </div>
                <span>Arquivos desorganizados e nomes confusos.</span>
              </li>
              <li className="flex items-start gap-3 text-slate-300">
                <div className="bg-red-500/10 p-1 rounded text-red-400 mt-1">
                  <Download className="w-4 h-4" />
                </div>
                <span>Downloads que falham ou esquecidos.</span>
              </li>
            </ul>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20 rounded-2xl blur-2xl"></div>
            <div className="relative bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="flex items-center gap-4 mb-6 border-b border-slate-800 pb-6">
                <div className="bg-emerald-500/20 p-3 rounded-xl">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">
                    O Jeito Gestor De Faturas
                  </h3>
                  <p className="text-slate-400 text-sm">
                    Problema resolvido em segundos
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 text-sm">
                    faturas_janeiro_2026.zip
                  </span>
                  <span className="text-indigo-400 text-xs font-bold bg-indigo-500/10 px-2 py-1 rounded">
                    PRONTO
                  </span>
                </div>
                <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 flex justify-between items-center">
                  <span className="text-slate-300 text-sm">
                    Relatório Completo
                  </span>
                  <span className="text-emerald-400 text-xs font-bold bg-emerald-500/10 px-2 py-1 rounded">
                    ENVIADO
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- 5. HOW IT WORKS (Passo a Passo) --- */}
      <section
        id="features"
        className="py-24 bg-slate-900/50 border-t border-slate-800"
      >
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Como funciona?
            </h2>
            <p className="text-slate-400">
              Três passos simples para recuperar seu tempo.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 text-xl font-bold text-indigo-500">
                1
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Conecte sua conta
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Use sua chave de API restrita (apenas leitura). Nós validamos
                sua conta instantaneamente sem salvar seus dados.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 text-xl font-bold text-indigo-500">
                2
              </div>
              <h3 className="text-xl font-bold text-white mb-3">
                Filtre o período
              </h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Selecione "Mês Passado", "Este Ano" ou uma data personalizada. O
                sistema busca todas as faturas pagas.
              </p>
            </div>
            <div className="bg-slate-950 border border-slate-800 p-8 rounded-2xl hover:border-indigo-500/50 transition-colors">
              <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center mb-6 text-xl font-bold text-indigo-500">
                3
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Baixe o ZIP</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Receba um único arquivo ZIP contendo todos os PDFs renomeados e
                organizados para sua contabilidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- 6. PRICING (Oferta) --- */}
      <section id="pricing" className="py-24 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Simples e Transparente
            </h2>
            <p className="text-slate-400">
              Comece de graça. Faça o upgrade se precisar de mais.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Plano Grátis */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800">
              <h3 className="text-xl font-bold text-white mb-2">Starter</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">R$ 0</span>
              </div>
              <p className="text-slate-400 text-sm mb-8">
                Para testar a ferramenta e ver a mágica acontecer.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" /> 1 Download
                  Gratuito (ZIP)
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" /> Filtros de
                  Data Básicos
                </li>
                <li className="flex items-center gap-3 text-slate-300 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-slate-500" /> Faturas em
                  PDF
                </li>
              </ul>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl border border-slate-700 text-white font-bold hover:bg-slate-800 transition-colors"
              >
                Testar Agora
              </button>
            </div>

            {/* Plano PRO */}
            <div className="p-8 rounded-3xl bg-slate-900 border border-indigo-500 relative transform md:scale-105 shadow-2xl shadow-indigo-500/20">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-indigo-500 text-white px-4 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                Recomendado
              </div>
              <h3 className="text-xl font-bold text-white mb-2">PRO</h3>
              <div className="flex items-baseline gap-1 mb-6">
                <span className="text-4xl font-bold text-white">R$ 49,90</span>
                <span className="text-slate-500">/mês</span>
              </div>
              <p className="text-indigo-200 text-sm mb-8">
                Liberdade total para sua empresa crescer.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />{" "}
                  <strong>Downloads Ilimitados</strong>
                </li>
                <li className="flex items-center gap-3 text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Histórico
                  Completo
                </li>
                <li className="flex items-center gap-3 text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Suporte
                  Prioritário
                </li>
                <li className="flex items-center gap-3 text-white text-sm">
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" /> Cancele
                  quando quiser
                </li>
              </ul>
              <button
                onClick={() => navigate("/login")}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-lg shadow-indigo-500/25"
              >
                Assinar PRO
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* --- 7. FAQ & FOOTER (Objeções) --- */}
      <section className="py-20 bg-slate-950 border-t border-slate-800">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-white mb-8 text-center">
            Perguntas Frequentes
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "É seguro usar minha chave da Stripe?",
                a: "Sim. Recomendamos usar uma chave de 'Somente Leitura'. Nós não salvamos sua chave em nenhum banco de dados, ela é usada apenas na memória durante a sua sessão.",
              },
              {
                q: "Como cancelo a assinatura?",
                a: "A qualquer momento. Basta enviar um e-mail para o suporte ou gerenciar sua assinatura diretamente pelo portal da Stripe que enviamos no e-mail de compra.",
              },
              {
                q: "Funciona para contas do Brasil?",
                a: "Sim! O sistema é otimizado para faturas em BRL e USD, gerando o padrão aceito pela contabilidade brasileira.",
              },
            ].map((faq, i) => (
              <div
                key={i}
                className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/50"
              >
                <button
                  onClick={() => toggleFaq(i)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-slate-800/50 transition-colors"
                >
                  <span className="font-medium text-slate-200">{faq.q}</span>
                  {openFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-slate-500" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="p-4 pt-0 text-slate-400 text-sm leading-relaxed border-t border-slate-800/50 mt-2">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 pt-8 border-t border-slate-900 text-center">
          {/* --- ADICIONEI OS LINKS DE MODAL AQUI (FALTAVA ISSO) --- */}
          <div className="flex justify-center gap-6 mb-4 text-xs font-medium text-slate-500">
            <button
              onClick={() => setModalType("terms")}
              className="hover:text-indigo-400 transition-colors"
            >
              Termos de Uso
            </button>
            <button
              onClick={() => setModalType("privacy")}
              className="hover:text-indigo-400 transition-colors"
            >
              Política de Privacidade
            </button>
          </div>

          <p className="text-slate-600 text-sm flex items-center justify-center gap-1">
            <Lock className="w-3 h-3" />
            Todos os direitos reservados 2026 Gestor de Faturas • Desenvolvido
            por
            <a
              href="https://www.instagram.com/wasselect"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold hover:text-indigo-400 transition-colors cursor-pointer"
            >
              WAS Select
            </a>
            .
          </p>
        </div>
      </section>
    </div>
  );
}
