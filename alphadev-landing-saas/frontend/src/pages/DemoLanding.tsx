import { SectionTitle } from "../components/landing/SectionTitle";
import { PublicLayout } from "../components/layout/PublicLayout";

const benefits = [
  "Landing responsiva para captar contatos",
  "Conteúdo preparado para edição futura",
  "CTA direto para WhatsApp",
];

const testimonials = [
  {
    name: "Marina Costa",
    text: "A página demo mostra exatamente o tipo de presença digital que eu queria para vender mais rápido.",
  },
  {
    name: "Rafael Lima",
    text: "Visual direto, seções claras e contato simples. É uma base excelente para pequenos negócios.",
  },
];

export function DemoLanding() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-black via-alpha-dark to-alpha-panel">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-alpha-red">
              Landing pública demo
            </p>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
              Transforme visitantes em clientes com uma landing objetiva.
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">
              Esta é uma simulação com dados mockados. Nas próximas etapas, o
              conteúdo virá do painel administrativo de cada cliente.
            </p>
            <a
              href="https://wa.me/5500000000000"
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-lg bg-alpha-red px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-red-600"
            >
              Chamar no WhatsApp
            </a>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
            <div className="aspect-[4/3] rounded-lg bg-[radial-gradient(circle_at_top_left,_rgba(239,29,47,0.42),_transparent_35%),linear-gradient(135deg,_#18181f,_#050507)] p-6">
              <div className="flex h-full flex-col justify-end">
                <span className="mb-3 h-10 w-10 rounded-lg bg-alpha-red" />
                <h2 className="text-2xl font-bold">Sua marca em destaque</h2>
                <p className="mt-2 text-sm text-slate-300">
                  Imagem e logo editáveis futuramente.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle
          eyebrow="Sobre"
          title="Uma landing pensada para conversão"
          description="Textos curtos, visual forte e chamadas claras para contato fazem parte da estrutura inicial."
        />
      </section>

      <section className="bg-black/35">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionTitle title="Benefícios" />
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit}
                className="rounded-lg border border-white/10 bg-white/[0.04] p-5"
              >
                <span className="mb-4 block h-2 w-12 rounded-full bg-alpha-red" />
                <h3 className="text-lg font-semibold text-white">{benefit}</h3>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle title="Depoimentos" />
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="rounded-lg border border-white/10 bg-alpha-panel p-6"
            >
              <p className="text-slate-300">"{testimonial.text}"</p>
              <strong className="mt-4 block text-white">{testimonial.name}</strong>
            </article>
          ))}
        </div>
      </section>

      <section className="bg-alpha-panel">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2">
          <div>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-alpha-red">
              Contato
            </p>
            <h2 className="text-3xl font-bold text-white">Solicite uma proposta</h2>
            <p className="mt-4 text-slate-300">
              Formulário visual para a próxima etapa de captura de leads.
            </p>
          </div>

          <form className="space-y-4 rounded-lg border border-white/10 bg-black/25 p-5">
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              placeholder="Nome"
              type="text"
            />
            <input
              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              placeholder="E-mail"
              type="email"
            />
            <textarea
              className="min-h-32 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500"
              placeholder="Mensagem"
            />
            <button
              className="w-full rounded-lg bg-alpha-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
              type="button"
            >
              Enviar interesse
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-4 py-8 text-center text-sm text-slate-400">
        AlphaDev Landing SaaS - Demo pública mockada
      </footer>
    </PublicLayout>
  );
}
