import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams } from "react-router-dom";
import { WhatsAppFloatingButton } from "../components/landing/WhatsAppFloatingButton";
import { createLeadForMainLanding } from "../services/publicLeadService";
import {
  getMainPublicLanding,
  getPublicLandingBySlug,
} from "../services/publicLandingService";
import type { LandingImage, LandingSection, PublicLandingResponse } from "../types/landing";
import { getImageUrl } from "../utils/getImageUrl";
import { getWhatsAppUrl } from "../utils/landingContent";
import { getLandingTheme, getLandingThemeStyle } from "../utils/landingTheme";

const fallbackPublicLanding: PublicLandingResponse = {
  landing: {
    id: "fallback-main",
    name: "Landing Principal",
    slug: "principal",
    businessName: "Nova Essencia",
    description:
      "Solucoes modernas e personalizadas para apresentar sua empresa com clareza, fortalecer sua presenca digital e facilitar o contato com novos clientes.",
  },
  theme: {
    primaryColor: "#2563eb",
    secondaryColor: "#4f46e5",
    backgroundColor: "#f8fafc",
    textColor: "#0f172a",
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sections: [
    {
      id: "hero",
      type: "HERO",
      title: "Solucoes modernas para transformar sua presenca digital",
      subtitle: "Nova Essencia",
      content:
        "Apresente sua empresa com clareza, destaque seus diferenciais e receba contatos qualificados em uma pagina rapida, bonita e totalmente personalizavel.",
      buttonLabel: "Solicitar atendimento",
      buttonUrl: "#contato",
      order: 1,
      isActive: true,
    },
    {
      id: "about",
      type: "ABOUT",
      title: "Uma apresentacao profissional para sua empresa",
      subtitle: "Clareza, confianca e conversao em uma unica experiencia",
      content:
        "Organize suas informacoes, servicos, imagens e canais de contato em uma experiencia clara, moderna e pensada para converter visitantes em clientes.",
      buttonLabel: null,
      buttonUrl: null,
      order: 2,
      isActive: true,
    },
    {
      id: "benefits",
      type: "BENEFITS",
      title: "Tudo que sua landing precisa para vender melhor",
      subtitle: "Recursos essenciais para uma presenca digital mais forte",
      content:
        "Design responsivo; carregamento rapido; conteudo editavel; formulario de leads; botao de WhatsApp; SEO basico; galeria de imagens; painel administrativo.",
      buttonLabel: null,
      buttonUrl: null,
      order: 3,
      isActive: true,
    },
    {
      id: "services",
      type: "CUSTOM",
      title: "Solucoes pensadas para o seu negocio",
      subtitle: "Servicos que deixam sua pagina mais completa",
      content:
        "Estrategia personalizada|Pagina otimizada|Captacao de contatos|Integracao com WhatsApp|Gestao simples|Visual adaptavel",
      buttonLabel: null,
      buttonUrl: null,
      order: 4,
      isActive: true,
    },
    {
      id: "gallery",
      type: "GALLERY",
      title: "Galeria",
      subtitle: "Mostre produtos, equipe, ambientes ou resultados",
      content: "Adicione imagens no painel para deixar sua landing mais visual, humana e confiavel.",
      buttonLabel: null,
      buttonUrl: null,
      order: 5,
      isActive: true,
    },
    {
      id: "testimonials",
      type: "TESTIMONIALS",
      title: "Depoimentos",
      subtitle: "Clientes que perceberam valor rapidamente",
      content:
        "Mariana Costa, Gestora Comercial: A pagina ficou clara, bonita e facilitou muito o contato dos clientes com nossa equipe.|Rafael Mendes, Empreendedor: Conseguimos apresentar nossos servicos de forma mais profissional e recebemos contatos mais qualificados.|Camila Rocha, Consultora: O painel tornou simples atualizar textos, imagens e informacoes sem depender de alteracoes no codigo.",
      buttonLabel: null,
      buttonUrl: null,
      order: 6,
      isActive: true,
    },
    {
      id: "cta",
      type: "CTA",
      title: "Pronto para personalizar sua pagina?",
      subtitle: "Atualize textos, cores, imagens e canais de contato diretamente pelo painel administrativo.",
      content: "Preencha o formulario ou chame pelo WhatsApp para iniciar uma conversa.",
      buttonLabel: "Entrar em contato",
      buttonUrl: "#contato",
      order: 7,
      isActive: true,
    },
    {
      id: "footer",
      type: "FOOTER",
      title: "Nova Essencia",
      subtitle: null,
      content: "Solucoes modernas e personalizadas para apresentar sua empresa com clareza.",
      buttonLabel: null,
      buttonUrl: null,
      order: 8,
      isActive: true,
    },
  ],
  images: [
    {
      id: "hero-image",
      sectionId: "hero",
      url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      alt: "Equipe trabalhando em um escritorio moderno e claro",
      type: "HERO",
      order: 1,
    },
    {
      id: "about-image",
      sectionId: "about",
      url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",
      alt: "Reuniao profissional com pessoas colaborando",
      type: "OTHER",
      order: 2,
    },
    {
      id: "gallery-1",
      sectionId: "gallery",
      url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
      alt: "Equipe analisando um projeto em notebooks",
      type: "GALLERY",
      order: 1,
    },
    {
      id: "gallery-2",
      sectionId: "gallery",
      url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
      alt: "Atendimento profissional em ambiente corporativo",
      type: "GALLERY",
      order: 2,
    },
    {
      id: "gallery-3",
      sectionId: "gallery",
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
      alt: "Pessoas planejando ideias em uma mesa de trabalho",
      type: "GALLERY",
      order: 3,
    },
  ],
  whatsapp: {
    phone: "5511999999999",
    defaultMessage:
      "Ola! Vim pela landing da Nova Essencia e gostaria de receber atendimento.",
    buttonLabel: "Chamar no WhatsApp",
    isEnabled: true,
  },
  seo: {
    metaTitle: "Nova Essencia | Solucoes Personalizadas",
    metaDescription:
      "Conheca solucoes modernas para apresentar sua empresa com clareza e receber contatos qualificados.",
    ogTitle: "Nova Essencia",
    ogDescription:
      "Uma pagina moderna para apresentar servicos, diferenciais e canais de contato.",
    ogImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    canonicalUrl: null,
  },
};

const initialForm = {
  name: "",
  phone: "",
  email: "",
  message: "",
  website: "",
};

const serviceDescriptions = [
  "Planejamento claro para destacar os pontos fortes do seu negocio.",
  "Estrutura rapida, objetiva e preparada para conversao.",
  "Formulario conectado ao painel para organizar oportunidades.",
  "Chamada direta para conversas com potenciais clientes.",
  "Edicao simples de textos, imagens, cores e canais de contato.",
  "Identidade neutra e flexivel para diferentes segmentos.",
];

const galleryPlaceholders = ["Imagem institucional", "Equipe", "Ambiente", "Projeto"];
const trustCards = ["Clareza", "Confianca", "Conversao"];
const stats = ["+120 projetos entregues", "98% de satisfacao", "Atendimento personalizado"];

type PageState =
  | { status: "loading" }
  | { status: "ready"; data: PublicLandingResponse }
  | { status: "not-found"; message: string }
  | { status: "error"; message: string };

function splitContent(value?: string | null, separator = ";") {
  return (value ?? "")
    .split(separator)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getSection(sections: LandingSection[], type: LandingSection["type"]) {
  return sections.find((section) => section.type === type);
}

function getSectionWithFallback(
  sections: LandingSection[],
  type: LandingSection["type"],
  fallback: LandingSection,
) {
  return getSection(sections, type) ?? fallback;
}

function getSectionImage(images: LandingImage[], section: LandingSection, type: LandingImage["type"]) {
  return (
    images.find((image) => image.sectionId === section.id) ??
    images.find((image) => image.type === type)
  );
}

function parseTestimonials(content?: string | null) {
  const items = splitContent(content, "|");

  if (items.length === 0) {
    return [
      {
        name: "Mariana Costa",
        role: "Gestora Comercial",
        text: "A pagina ficou clara, bonita e facilitou muito o contato dos clientes com nossa equipe.",
      },
      {
        name: "Rafael Mendes",
        role: "Empreendedor",
        text: "Conseguimos apresentar nossos servicos de forma mais profissional e recebemos contatos mais qualificados.",
      },
      {
        name: "Camila Rocha",
        role: "Consultora",
        text: "O painel tornou simples atualizar textos, imagens e informacoes sem depender de alteracoes no codigo.",
      },
    ];
  }

  return items.map((item, index) => {
    const [person, text] = item.split(":");
    const [name, role] = (person ?? "").split(",");

    return {
      name: name?.trim() || `Cliente ${index + 1}`,
      role: role?.trim() || "Cliente",
      text: (text ?? item).trim(),
    };
  });
}

function IconBadge({ children }: { children: string }) {
  return (
    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-600">
      {children}
    </span>
  );
}

export function PublicLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [pageState, setPageState] = useState<PageState>({ status: "loading" });
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    async function loadLanding() {
      setPageState({ status: "loading" });

      try {
        const data = slug ? await getPublicLandingBySlug(slug) : await getMainPublicLanding();
        setPageState({ status: "ready", data });
      } catch (requestError) {
        if (!slug) {
          setPageState({ status: "ready", data: fallbackPublicLanding });
          return;
        }

        if (isAxiosError(requestError) && requestError.response?.status === 404) {
          setPageState({
            status: "not-found",
            message: "Landing publica nao encontrada ou indisponivel.",
          });
          return;
        }

        setPageState({
          status: "error",
          message: "Nao foi possivel carregar esta landing agora.",
        });
      }
    }

    loadLanding();
  }, [slug]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback("");
    setError("");

    if (form.name.trim().length < 2 || form.phone.trim().length < 8) {
      setError("Nao foi possivel enviar sua mensagem. Confira os dados e tente novamente.");
      return;
    }

    setIsSubmitting(true);

    try {
      await createLeadForMainLanding({
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message,
        website: form.website,
        source: "landing-form",
        utmSource: searchParams.get("utm_source") ?? undefined,
        utmMedium: searchParams.get("utm_medium") ?? undefined,
        utmCampaign: searchParams.get("utm_campaign") ?? undefined,
      });
      setFeedback("Mensagem enviada com sucesso. Em breve entraremos em contato.");
      setForm(initialForm);
    } catch {
      setError("Nao foi possivel enviar sua mensagem. Confira os dados e tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (pageState.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center text-slate-900">
        <p className="text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
          Carregando landing...
        </p>
      </div>
    );
  }

  if (pageState.status === "not-found" || pageState.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-center text-slate-900">
        <div className="max-w-md">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.24em] text-blue-600">
            Landing publica
          </p>
          <h1 className="text-3xl font-black">Landing indisponivel</h1>
          <p className="mt-4 text-slate-600">{pageState.message}</p>
        </div>
      </div>
    );
  }

  const { data } = pageState;
  const theme = getLandingTheme(data.theme);
  const style = getLandingThemeStyle(theme);
  const sections = data.sections.length > 0 ? data.sections : fallbackPublicLanding.sections;
  const title = data.seo?.metaTitle ?? data.landing.businessName;
  const description = data.seo?.metaDescription ?? data.landing.description;
  const logo = data.images.find((image) => image.type === "LOGO");

  const hero = getSectionWithFallback(sections, "HERO", fallbackPublicLanding.sections[0]);
  const about = getSectionWithFallback(sections, "ABOUT", fallbackPublicLanding.sections[1]);
  const benefits = getSectionWithFallback(sections, "BENEFITS", fallbackPublicLanding.sections[2]);
  const services =
    getSection(sections, "CUSTOM") ??
    ({
      ...fallbackPublicLanding.sections[3],
      id: "services-fallback",
    } as LandingSection);
  const gallery = getSectionWithFallback(sections, "GALLERY", fallbackPublicLanding.sections[4]);
  const testimonials = getSectionWithFallback(
    sections,
    "TESTIMONIALS",
    fallbackPublicLanding.sections[5],
  );
  const cta = getSectionWithFallback(sections, "CTA", fallbackPublicLanding.sections[6]);
  const footer = getSectionWithFallback(sections, "FOOTER", fallbackPublicLanding.sections[7]);

  const heroImage = getSectionImage(data.images, hero, "HERO");
  const aboutImage =
    getSectionImage(data.images, about, "OTHER") ?? data.images.find((image) => image.type === "HERO");
  const galleryImages = data.images.filter(
    (image) => image.sectionId === gallery.id || image.type === "GALLERY",
  );
  const benefitItems = splitContent(benefits.content);
  const serviceItems = splitContent(services.content, "|");
  const testimonialItems = parseTestimonials(testimonials.content);
  const whatsappUrl = data.whatsapp?.isEnabled
    ? getWhatsAppUrl(data.whatsapp.phone, data.whatsapp.defaultMessage)
    : "#contato";

  const accentGradient = `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor}, #14b8a6)`;

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-900" style={style}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content={theme.primaryColor} />
        {data.seo?.ogTitle ? <meta property="og:title" content={data.seo.ogTitle} /> : null}
        {data.seo?.ogDescription ? (
          <meta property="og:description" content={data.seo.ogDescription} />
        ) : null}
        {data.seo?.ogImage ? <meta property="og:image" content={data.seo.ogImage} /> : null}
        {data.seo?.canonicalUrl ? <link rel="canonical" href={data.seo.canonicalUrl} /> : null}
      </Helmet>

      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/85 px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <a className="flex min-w-0 items-center gap-3" href="#inicio">
            {logo ? (
              <img
                className="max-h-11 max-w-40 object-contain"
                src={getImageUrl(logo.url)}
                alt={logo.alt}
                loading="eager"
              />
            ) : (
              <>
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black text-white shadow-lg shadow-blue-500/20"
                  style={{ background: accentGradient }}
                >
                  {data.landing.businessName.slice(0, 1).toUpperCase()}
                </span>
                <span className="truncate text-base font-black">{data.landing.businessName}</span>
              </>
            )}
          </a>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-600 lg:flex">
            <a className="transition hover:text-blue-600" href="#inicio">
              Inicio
            </a>
            <a className="transition hover:text-blue-600" href="#sobre">
              Sobre
            </a>
            <a className="transition hover:text-blue-600" href="#solucoes">
              Solucoes
            </a>
            <a className="transition hover:text-blue-600" href="#depoimentos">
              Depoimentos
            </a>
            <a className="transition hover:text-blue-600" href="#contato">
              Contato
            </a>
          </nav>

          <a
            className="inline-flex shrink-0 items-center justify-center rounded-full px-5 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5"
            href="#contato"
            style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
          >
            Fale conosco
          </a>
        </div>
      </header>

      <main>
        <section
          id="inicio"
          className="relative overflow-hidden px-4 py-16 sm:px-6 lg:py-24"
          style={{ backgroundColor: theme.backgroundColor }}
        >
          <div
            className="absolute left-1/2 top-10 h-72 w-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl"
            style={{ background: accentGradient }}
          />
          <div className="relative mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1fr_0.9fr]">
            <div className="animate-[fadeIn_0.7s_ease-out]">
              {hero.subtitle ? (
                <p className="mb-5 text-xs font-black uppercase tracking-[0.28em] text-blue-600">
                  {hero.subtitle}
                </p>
              ) : null}
              <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>
              {hero.content ? (
                <p className="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
                  {hero.content}
                </p>
              ) : null}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-bold text-white shadow-xl shadow-blue-500/20 transition hover:-translate-y-0.5"
                  href="#contato"
                  style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
                >
                  {hero.buttonLabel ?? "Solicitar atendimento"}
                </a>
                <a
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-800 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:text-blue-700"
                  href="#solucoes"
                >
                  Conhecer solucoes
                </a>
              </div>

              <div className="mt-10 grid gap-3 sm:grid-cols-3">
                {stats.map((stat) => (
                  <div
                    className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-sm backdrop-blur"
                    key={stat}
                  >
                    <strong className="block text-sm text-slate-950">{stat}</strong>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative animate-[fadeIn_0.9s_ease-out]">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-3xl opacity-80" style={{ background: accentGradient }} />
              <div className="relative rounded-[2rem] border border-white bg-white p-3 shadow-2xl shadow-slate-300/70">
                {heroImage ? (
                  <img
                    className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                    src={getImageUrl(heroImage.url)}
                    alt={heroImage.alt}
                    loading="eager"
                  />
                ) : (
                  <div
                    className="flex aspect-[4/3] w-full items-center justify-center rounded-[1.5rem] p-8 text-center text-xl font-black text-white"
                    style={{ background: accentGradient }}
                  >
                    Sua marca em destaque
                  </div>
                )}
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/70 bg-white/90 p-4 shadow-xl backdrop-blur">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-500">
                    Modelo profissional
                  </p>
                  <strong className="mt-1 block text-lg text-slate-950">
                    Conteudo editavel pelo painel
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="sobre" className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
            <div className="rounded-[2rem] border border-slate-200 bg-white p-3 shadow-xl shadow-slate-200/80">
              {aboutImage ? (
                <img
                  className="aspect-[4/3] w-full rounded-[1.5rem] object-cover"
                  src={getImageUrl(aboutImage.url)}
                  alt={aboutImage.alt}
                  loading="lazy"
                />
              ) : (
                <div className="aspect-[4/3] rounded-[1.5rem] bg-gradient-to-br from-blue-100 via-indigo-100 to-teal-100" />
              )}
            </div>
            <div>
              <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-blue-600">
                Sobre
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {about.title}
              </h2>
              {about.content ? (
                <p className="mt-5 text-base leading-8 text-slate-600">{about.content}</p>
              ) : null}
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {trustCards.map((card, index) => (
                  <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm" key={card}>
                    <IconBadge>{String(index + 1).padStart(2, "0")}</IconBadge>
                    <strong className="mt-4 block text-slate-950">{card}</strong>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="solucoes" className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-blue-600">
                Solucoes
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {services.title}
              </h2>
              {services.subtitle ? (
                <p className="mt-4 text-slate-600">{services.subtitle}</p>
              ) : null}
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {serviceItems.map((service, index) => (
                <article
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  key={service}
                >
                  <IconBadge>{String(index + 1).padStart(2, "0")}</IconBadge>
                  <h3 className="mt-5 text-lg font-black text-slate-950">{service}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {serviceDescriptions[index] ?? "Personalize este servico pelo painel administrativo."}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:py-24" style={{ backgroundColor: "#eef2ff" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-blue-600">
                Beneficios
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {benefits.title}
              </h2>
              {benefits.subtitle ? <p className="mt-4 text-slate-600">{benefits.subtitle}</p> : null}
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {benefitItems.map((benefit) => (
                <div className="rounded-2xl border border-white bg-white p-5 shadow-sm" key={benefit}>
                  <span className="mb-4 block h-2 w-12 rounded-full" style={{ background: accentGradient }} />
                  <strong className="text-slate-950">{benefit}</strong>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto max-w-7xl">
            <div className="mb-10 max-w-3xl">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-blue-600">
                Galeria
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {gallery.title}
              </h2>
              {gallery.subtitle ? <p className="mt-4 text-slate-600">{gallery.subtitle}</p> : null}
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {galleryImages.length > 0
                ? galleryImages.slice(0, 4).map((image) => (
                    <div
                      className="overflow-hidden rounded-3xl border border-slate-200 bg-white p-2 shadow-sm"
                      key={image.id}
                    >
                      <img
                        className="aspect-[4/3] w-full rounded-[1.25rem] object-cover"
                        src={getImageUrl(image.url)}
                        alt={image.alt}
                        loading="lazy"
                      />
                    </div>
                  ))
                : galleryPlaceholders.map((item) => (
                    <div
                      className="flex aspect-[4/3] items-end rounded-3xl p-5 text-lg font-black text-white shadow-sm"
                      key={item}
                      style={{ background: accentGradient }}
                    >
                      {item}
                    </div>
                  ))}
            </div>
          </div>
        </section>

        <section id="depoimentos" className="px-4 py-16 sm:px-6 lg:py-24" style={{ backgroundColor: "#f1f5f9" }}>
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto mb-12 max-w-3xl text-center">
              <p className="mb-4 text-xs font-black uppercase tracking-[0.26em] text-blue-600">
                Depoimentos
              </p>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {testimonials.title}
              </h2>
              {testimonials.subtitle ? (
                <p className="mt-4 text-slate-600">{testimonials.subtitle}</p>
              ) : null}
            </div>
            <div className="grid gap-5 lg:grid-cols-3">
              {testimonialItems.map((testimonial) => (
                <article
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                  key={`${testimonial.name}-${testimonial.role}`}
                >
                  <p className="text-base leading-8 text-slate-700">"{testimonial.text}"</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                      {testimonial.name.slice(0, 1)}
                    </span>
                    <div>
                      <strong className="block text-slate-950">{testimonial.name}</strong>
                      <span className="text-sm text-slate-500">{testimonial.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contato" className="px-4 py-16 sm:px-6 lg:py-24">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-[2rem] p-8 text-white shadow-2xl shadow-blue-500/20" style={{ background: accentGradient }}>
              <p className="text-xs font-black uppercase tracking-[0.26em] text-white/70">
                Contato
              </p>
              <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">{cta.title}</h2>
              {cta.subtitle ? <p className="mt-5 leading-8 text-white/85">{cta.subtitle}</p> : null}
              {cta.content ? <p className="mt-4 leading-8 text-white/75">{cta.content}</p> : null}
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-black text-blue-700 transition hover:-translate-y-0.5"
                  href="#contato"
                >
                  {cta.buttonLabel ?? "Entrar em contato"}
                </a>
                {data.whatsapp?.isEnabled ? (
                  <a
                    className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 text-sm font-black text-white transition hover:-translate-y-0.5 hover:bg-white/10"
                    href={whatsappUrl}
                    rel="noreferrer"
                    target="_blank"
                  >
                    {data.whatsapp.buttonLabel}
                  </a>
                ) : null}
              </div>
            </div>

            <form
              className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-200/80 sm:p-8"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Nome</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Seu nome"
                    type="text"
                    value={form.name}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Telefone</span>
                  <input
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    placeholder="Seu telefone"
                    type="tel"
                    value={form.phone}
                  />
                </label>
              </div>
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Email</span>
                <input
                  className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="seuemail@exemplo.com"
                  type="email"
                  value={form.email}
                />
              </label>
              <input
                aria-hidden="true"
                autoComplete="off"
                className="hidden"
                onChange={(event) => setForm({ ...form, website: event.target.value })}
                tabIndex={-1}
                type="text"
                value={form.website}
              />
              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Mensagem</span>
                <textarea
                  className="min-h-32 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="Conte como podemos ajudar"
                  value={form.message}
                />
              </label>
              <button
                className="mt-5 w-full rounded-2xl px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
                type="submit"
              >
                {isSubmitting ? "Enviando..." : "Enviar mensagem"}
              </button>
              {feedback ? <p className="mt-4 text-sm font-semibold text-green-700">{feedback}</p> : null}
              {error ? <p className="mt-4 text-sm font-semibold text-red-700">{error}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-[1fr_auto_auto]">
          <div>
            <strong className="text-lg text-slate-950">{footer.title}</strong>
            {footer.content ? (
              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">{footer.content}</p>
            ) : null}
          </div>
          <div className="text-sm leading-7 text-slate-600">
            <strong className="block text-slate-950">Links rapidos</strong>
            <a className="block hover:text-blue-600" href="#sobre">Sobre</a>
            <a className="block hover:text-blue-600" href="#solucoes">Solucoes</a>
            <a className="block hover:text-blue-600" href="#contato">Contato</a>
          </div>
          <div className="text-sm leading-7 text-slate-600">
            <strong className="block text-slate-950">Contato</strong>
            <span className="block">Atendimento personalizado</span>
            <span className="block">{new Date().getFullYear()} - Todos os direitos reservados.</span>
          </div>
        </div>
      </footer>

      <WhatsAppFloatingButton whatsapp={data.whatsapp} theme={theme} />
    </div>
  );
}
