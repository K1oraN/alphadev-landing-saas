import { AdminFeatureCard } from "../components/admin/AdminFeatureCard";
import { PublicLayout } from "../components/layout/PublicLayout";

const features = [
  {
    title: "Editar textos",
    description: "Área planejada para alterar títulos, descrições, CTAs e seções da landing.",
  },
  {
    title: "Alterar cores",
    description: "Configuração futura de paleta visual para cada cliente.",
  },
  {
    title: "Gerenciar imagens",
    description: "Espaço reservado para logo, hero, banners e imagens de apoio.",
  },
  {
    title: "Configurar WhatsApp",
    description: "Campo futuro para número, mensagem inicial e botão principal.",
  },
  {
    title: "Ver leads",
    description: "Preview da área que listará contatos recebidos pelo formulário.",
  },
];

export function AdminPreview() {
  return (
    <PublicLayout>
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <div className="mb-10 max-w-3xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-alpha-red">
            Painel administrativo futuro
          </p>
          <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
            Preview da área de gestão da landing
          </h1>
          <p className="mt-5 text-lg leading-8 text-slate-300">
            Esta tela apenas simula os módulos que serão implementados nas próximas
            etapas. Login, edição real, autenticação JWT e dashboard completo ainda
            não fazem parte desta fase.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <AdminFeatureCard key={feature.title} {...feature} />
          ))}
        </div>

        <div className="mt-10 rounded-lg border border-red-500/30 bg-red-500/10 p-5 text-sm leading-6 text-red-100">
          Etapa 1: estrutura inicial pronta para evoluir para autenticação, edição
          real de conteúdo e cadastro de leads.
        </div>
      </section>
    </PublicLayout>
  );
}
