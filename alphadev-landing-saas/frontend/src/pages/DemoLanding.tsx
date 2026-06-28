import { useEffect, useMemo, useState } from "react";
import { SectionTitle } from "../components/landing/SectionTitle";
import { PublicLayout } from "../components/layout/PublicLayout";
import { api } from "../services/api";
import type { DemoLandingResponse, DemoLandingSection } from "../types/landing";

const fallbackLanding: DemoLandingResponse = {
  id: "mock-demo",
  name: "Landing Barbearia Demo",
  slug: "barbearia-demo",
  businessName: "Barbearia Demo AlphaDev",
  description:
    "Barbearia premium com atendimento agendado, cortes modernos, barba alinhada e experiencia completa.",
  status: "PUBLISHED",
  plan: "PRO",
  theme: {
    primaryColor: "#ef1d2f",
    secondaryColor: "#111116",
    backgroundColor: "#07070a",
    textColor: "#f8fafc",
    buttonColor: "#ef1d2f",
    buttonTextColor: "#ffffff",
    fontFamily: "Inter",
  },
  sections: [
    {
      id: "hero",
      type: "HERO",
      title: "Corte, barba e estilo no mesmo lugar",
      subtitle: "Barbearia Demo AlphaDev",
      content:
        "Atendimento profissional, ambiente moderno e agendamento simples para voce cuidar do visual sem perder tempo.",
      buttonLabel: "Agendar pelo WhatsApp",
      buttonUrl: "https://wa.me/5511999999999",
      order: 1,
      isActive: true,
    },
    {
      id: "about",
      type: "ABOUT",
      title: "Sobre a barbearia",
      subtitle: "Experiencia completa para o publico masculino",
      content:
        "Unimos tecnica, pontualidade e atendimento de alto padrao para entregar cortes, barba e acabamento com consistencia.",
      buttonLabel: null,
      buttonUrl: null,
      order: 2,
      isActive: true,
    },
    {
      id: "benefits",
      type: "BENEFITS",
      title: "Beneficios",
      subtitle: "Por que escolher a Barbearia Demo AlphaDev",
      content:
        "Agendamento rapido; profissionais experientes; ambiente confortavel; atendimento personalizado.",
      buttonLabel: null,
      buttonUrl: null,
      order: 3,
      isActive: true,
    },
    {
      id: "testimonials",
      type: "TESTIMONIALS",
      title: "Depoimentos",
      subtitle: "Clientes que recomendam",
      content:
        "Atendimento impecavel e corte muito bem feito.|Melhor experiencia de barbearia da regiao.",
      buttonLabel: null,
      buttonUrl: null,
      order: 4,
      isActive: true,
    },
    {
      id: "cta",
      type: "CTA",
      title: "Pronto para renovar seu estilo?",
      subtitle: "Fale agora com a equipe",
      content: "Clique no botao e agende seu horario pelo WhatsApp em poucos minutos.",
      buttonLabel: "Chamar no WhatsApp",
      buttonUrl: "https://wa.me/5511999999999",
      order: 5,
      isActive: true,
    },
  ],
  images: [
    {
      id: "hero-image",
      url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
      alt: "Barbeiro fazendo acabamento em cliente",
      type: "HERO",
      order: 1,
    },
  ],
  whatsappConfig: {
    phone: "5511999999999",
    defaultMessage:
      "Ola! Vim pela landing da Barbearia Demo AlphaDev e quero agendar um horario.",
    buttonLabel: "Agendar pelo WhatsApp",
    isEnabled: true,
  },
  seoConfig: null,
  leadsCount: 3,
};

function getSection(sections: DemoLandingSection[], type: DemoLandingSection["type"]) {
  return sections.find((section) => section.type === type && section.isActive);
}

function splitContent(content?: string | null, separator = ";") {
  return (content ?? "")
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function DemoLanding() {
  const [landing, setLanding] = useState<DemoLandingResponse>(fallbackLanding);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    async function loadLanding() {
      try {
        const response = await api.get<DemoLandingResponse>("/api/demo/landing");
        setLanding(response.data);
        setIsFallback(false);
      } catch {
        setLanding(fallbackLanding);
        setIsFallback(true);
      }
    }

    loadLanding();
  }, []);

  const sections = landing.sections;
  const hero = getSection(sections, "HERO") ?? fallbackLanding.sections[0];
  const about = getSection(sections, "ABOUT") ?? fallbackLanding.sections[1];
  const benefitsSection = getSection(sections, "BENEFITS") ?? fallbackLanding.sections[2];
  const testimonialsSection =
    getSection(sections, "TESTIMONIALS") ?? fallbackLanding.sections[3];
  const cta = getSection(sections, "CTA") ?? fallbackLanding.sections[4];
  const heroImage =
    landing.images.find((image) => image.type === "HERO") ?? fallbackLanding.images[0];

  const benefits = useMemo(
    () => splitContent(benefitsSection.content),
    [benefitsSection.content],
  );

  const testimonials = useMemo(
    () => splitContent(testimonialsSection.content, "|"),
    [testimonialsSection.content],
  );

  const whatsappUrl =
    cta.buttonUrl ??
    (landing.whatsappConfig
      ? `https://wa.me/${landing.whatsappConfig.phone}?text=${encodeURIComponent(
          landing.whatsappConfig.defaultMessage,
        )}`
      : fallbackLanding.whatsappConfig
        ? `https://wa.me/${fallbackLanding.whatsappConfig.phone}`
        : "#");

  return (
    <PublicLayout>
      {isFallback ? (
        <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-center text-sm text-yellow-100">
          Ambiente demo usando dados mockados. Inicie o backend e rode o seed para
          carregar dados reais do PostgreSQL.
        </div>
      ) : null}

      <section className="bg-gradient-to-b from-black via-alpha-dark to-alpha-panel">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.28em] text-alpha-red">
              {hero.subtitle}
            </p>
            <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
              {hero.title}
            </h1>
            <p className="mt-5 text-lg leading-8 text-slate-300">{hero.content}</p>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-8 inline-flex rounded-lg bg-alpha-red px-5 py-3 text-sm font-semibold text-white shadow-glow transition hover:bg-red-600"
            >
              {landing.whatsappConfig?.buttonLabel ?? hero.buttonLabel}
            </a>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <img
              className="aspect-[4/3] w-full rounded-lg object-cover"
              src={heroImage.url}
              alt={heroImage.alt}
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <SectionTitle
          eyebrow="Sobre"
          title={about.title}
          description={about.content ?? landing.description}
        />
      </section>

      <section className="bg-black/35">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
          <SectionTitle
            title={benefitsSection.title}
            description={benefitsSection.subtitle ?? undefined}
          />
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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
        <SectionTitle
          title={testimonialsSection.title}
          description={testimonialsSection.subtitle ?? undefined}
        />
        <div className="grid gap-4 md:grid-cols-2">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial}
              className="rounded-lg border border-white/10 bg-alpha-panel p-6"
            >
              <p className="text-slate-300">"{testimonial}"</p>
              <strong className="mt-4 block text-white">Cliente {index + 1}</strong>
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
            <h2 className="text-3xl font-bold text-white">{cta.title}</h2>
            <p className="mt-4 text-slate-300">{cta.content}</p>
            <p className="mt-4 text-sm text-slate-400">
              Leads registrados na demo: {landing.leadsCount}
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
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex w-full justify-center rounded-lg bg-alpha-red px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600"
            >
              {cta.buttonLabel ?? "Enviar interesse"}
            </a>
          </form>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-4 py-8 text-center text-sm text-slate-400">
        {landing.businessName} - {landing.plan}
      </footer>
    </PublicLayout>
  );
}
