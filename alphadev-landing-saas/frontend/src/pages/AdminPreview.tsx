import { useNavigate } from "react-router-dom";
import { AdminFeatureCard } from "../components/admin/AdminFeatureCard";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    title: "Minha Landing",
    description: "Resumo visual da landing vinculada ao usuario autenticado.",
  },
  {
    title: "Editar Textos",
    description: "Modulo reservado para alterar titulos, descricoes, secoes e CTAs.",
  },
  {
    title: "Alterar Cores",
    description: "Area futura para configurar tema, cores de botoes e identidade visual.",
  },
  {
    title: "Gerenciar Imagens",
    description: "Espaco planejado para logo, hero, galeria e imagens de apoio.",
  },
  {
    title: "Configurar WhatsApp",
    description: "Configuracao futura de numero, mensagem padrao e botao flutuante.",
  },
  {
    title: "Leads Recebidos",
    description: "Preview da area que exibira contatos capturados pela landing.",
  },
];

export function AdminPreview() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  function handleLogout() {
    logout();
    navigate("/admin/login", { replace: true });
  }

  return (
    <div className="min-h-screen bg-alpha-dark text-slate-50">
      <header className="border-b border-white/10 bg-black/40">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-alpha-red">
              Painel administrativo
            </p>
            <h1 className="mt-2 text-2xl font-black">AlphaDev Landing SaaS</h1>
          </div>

          <button
            className="rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            onClick={handleLogout}
            type="button"
          >
            Sair
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <section className="rounded-lg border border-red-500/20 bg-red-500/10 p-6 shadow-glow">
          <p className="text-sm font-semibold text-red-100">
            Ola, {user?.name ?? "usuario"}.
          </p>
          <h2 className="mt-3 text-3xl font-black sm:text-4xl">
            Seu painel protegido esta ativo.
          </h2>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-red-50/80">
            Esta etapa valida login, sessao com token JWT, rota protegida e logout.
            A edicao real de conteudo sera implementada na proxima etapa.
          </p>
        </section>

        <section className="mt-10">
          <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-alpha-red">
                Modulos futuros
              </p>
              <h2 className="mt-2 text-2xl font-black">Gestao da landing</h2>
            </div>
            <p className="text-sm text-slate-400">{user?.email}</p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <AdminFeatureCard key={feature.title} {...feature} />
            ))}
          </div>
        </section>

        <div className="mt-10 rounded-lg border border-white/10 bg-white/[0.04] p-5 text-sm leading-6 text-slate-300">
          Login, permanencia autenticada e protecao do painel estao prontos. CRUD,
          upload, dashboard completo e salvamento de leads ainda nao fazem parte desta
          etapa.
        </div>
      </main>
    </div>
  );
}
