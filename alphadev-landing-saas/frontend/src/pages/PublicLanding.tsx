import { isAxiosError } from "axios";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  HeartHandshake,
  HeartPulse,
  Mail,
  MapPin,
  MessageCircle,
  Network,
  Phone,
  Quote,
  Share2,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Tag,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
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
    name: "SuaMarca",
    slug: "principal",
    businessName: "SuaMarca",
    description:
      "Atendimento de qualidade, com atencao aos detalhes e foco no que realmente importa: o seu bem-estar.",
  },
  theme: {
    primaryColor: "#2563eb",
    secondaryColor: "#1e40af",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  sections: [
    {
      id: "hero",
      type: "HERO",
      title: "Cuidado e atendimento profissional para voce",
      subtitle: "",
      content:
        "Atendimento de qualidade, com atencao aos detalhes e foco no que realmente importa: o seu bem-estar.",
      buttonLabel: "Agendar agora",
      buttonUrl: "#contato",
      order: 1,
      isActive: true,
    },
    {
      id: "about",
      type: "ABOUT",
      title: "Sobre o profissional",
      subtitle: "",
      content:
        "Aqui, voce encontra um atendimento personalizado, com foco no seu bem-estar e resultados reais. Minha missao e oferecer o melhor cuidado para ajudar voce a alcancar seus objetivos com seguranca e confianca.",
      buttonLabel: null,
      buttonUrl: null,
      order: 2,
      isActive: true,
    },
    {
      id: "benefits",
      type: "BENEFITS",
      title: "Diferenciais",
      subtitle: "",
      content:
        "Atendimento humanizado;Horarios flexiveis;Equipe qualificada;Agendamento facil",
      buttonLabel: null,
      buttonUrl: null,
      order: 3,
      isActive: true,
    },
    {
      id: "services",
      type: "CUSTOM",
      title: "Nossos servicos",
      subtitle: "Solucoes personalizadas para atender o que voce precisa.",
      content:
        "Consulta inicial|Acompanhamento|Avaliacao|Tratamentos|Planos|Orientacao personalizada",
      buttonLabel: null,
      buttonUrl: null,
      order: 4,
      isActive: true,
    },
    {
      id: "testimonials",
      type: "TESTIMONIALS",
      title: "O que nossos clientes dizem",
      subtitle: "",
      content:
        "Juliana Martins, Cliente: Excelente profissional! Me senti acolhida desde o primeiro atendimento. Resultados incriveis e muito alem do que eu esperava.|Ricardo Almeida, Cliente: Atendimento impecavel, sempre atenciosa e dedicada. Recomendo de olhos fechados!|Camila Souza, Cliente: Profissional incrivel e ambiente aconchegante. Me ajudou a conquistar meus objetivos com muita dedicacao.",
      buttonLabel: null,
      buttonUrl: null,
      order: 5,
      isActive: true,
    },
    {
      id: "cta",
      type: "CTA",
      title: "Pronto para agendar seu atendimento?",
      subtitle: "De o primeiro passo para cuidar de voce. Estou aqui para ajudar!",
      content: "",
      buttonLabel: "Agendar agora",
      buttonUrl: "#contato",
      order: 6,
      isActive: true,
    },
    {
      id: "footer",
      type: "FOOTER",
      title: "SuaMarca",
      subtitle: null,
      content: "Cuidado, atencao e resultados para o que mais importa: voce.",
      buttonLabel: null,
      buttonUrl: null,
      order: 7,
      isActive: true,
    },
  ],
  images: [],
  whatsapp: {
    phone: "5511987654321",
    defaultMessage: "Ola! Vim pela landing e gostaria de agendar um atendimento.",
    buttonLabel: "Agendar agora",
    isEnabled: true,
  },
  seo: {
    metaTitle: "SuaMarca | Atendimento profissional",
    metaDescription:
      "Atendimento profissional, humanizado e personalizado para voce.",
    ogTitle: "SuaMarca",
    ogDescription: "Agende seu atendimento de forma simples e segura.",
    ogImage: null,
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

const featureFallbacks = [
  {
    title: "Atendimento humanizado",
    description: "Olhar atento e acolhedor para entender suas necessidades.",
    icon: HeartHandshake,
  },
  {
    title: "Horarios flexiveis",
    description: "Opcoes de horarios que cabem na sua rotina.",
    icon: Clock3,
  },
  {
    title: "Equipe qualificada",
    description: "Profissionais experientes e em constante atualizacao.",
    icon: ShieldCheck,
  },
  {
    title: "Agendamento facil",
    description: "Processo simples, rapido e 100% online.",
    icon: CalendarDays,
  },
];

const serviceFallbacks = [
  {
    title: "Consulta inicial",
    description: "Avaliacao completa e plano personalizado.",
    icon: Stethoscope,
  },
  {
    title: "Acompanhamento",
    description: "Suporte continuo para evolucao dos resultados.",
    icon: ArrowRight,
  },
  {
    title: "Avaliacao",
    description: "Analises detalhadas para entender suas necessidades.",
    icon: CalendarDays,
  },
  {
    title: "Tratamentos",
    description: "Solucoes eficazes para seu bem-estar.",
    icon: HeartPulse,
  },
  {
    title: "Planos",
    description: "Opcoes que cabem no seu momento.",
    icon: Tag,
  },
  {
    title: "Orientacao personalizada",
    description: "Dicas e orientacoes focadas em voce.",
    icon: MessageCircle,
  },
];

const faqItems = [
  {
    question: "Como faco para agendar um atendimento?",
    answer:
      "Voce pode agendar de forma rapida pelo botao Agendar agora, pelo WhatsApp ou entrando em contato por telefone ou e-mail.",
  },
  {
    question: "Quais sao os horarios de atendimento?",
    answer:
      "Os horarios podem variar conforme disponibilidade. A agenda exibida mostra opcoes proximas e voce pode confirmar pelo contato principal.",
  },
  {
    question: "Os atendimentos sao presenciais ou online?",
    answer:
      "A modalidade depende do servico escolhido. O administrador pode personalizar esta informacao no conteudo da landing.",
  },
  {
    question: "Aceitam convenios ou planos?",
    answer:
      "As condicoes comerciais podem ser confirmadas diretamente no atendimento.",
  },
  {
    question: "Posso remarcar ou cancelar meu horario?",
    answer:
      "Sim. Entre em contato com antecedencia para verificar a melhor opcao de remarcacao.",
  },
  {
    question: "Quais formas de pagamento sao aceitas?",
    answer:
      "As formas de pagamento podem ser combinadas no momento do agendamento.",
  },
  {
    question: "Como entro em contato?",
    answer:
      "Use o WhatsApp, telefone, e-mail ou formulario disponiveis na secao de contato.",
  },
];

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
  return sections.find((section) => section.type === type && section.isActive);
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

  return items.map((item, index) => {
    const [person, ...textParts] = item.split(":");
    const [name, role] = (person ?? "").split(",");

    return {
      name: name?.trim() || `Cliente ${index + 1}`,
      role: role?.trim() || "Cliente",
      text: textParts.join(":").trim() || item,
    };
  });
}

function BrandMark({ logo, name }: { logo?: LandingImage; name: string }) {
  if (logo) {
    return (
      <img
        alt={logo.alt}
        className="max-h-10 max-w-40 object-contain"
        loading="eager"
        src={getImageUrl(logo.url)}
      />
    );
  }

  return (
    <span className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-full bg-blue-600 text-white shadow-lg shadow-blue-600/20">
        <Sparkles size={18} strokeWidth={2.4} />
      </span>
      <span className="truncate text-xl font-black text-slate-950">{name || "SuaMarca"}</span>
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
      <div className="grid min-h-screen place-items-center bg-white px-4 text-center text-slate-900">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
          Carregando landing
        </p>
      </div>
    );
  }

  if (pageState.status === "not-found" || pageState.status === "error") {
    return (
      <div className="grid min-h-screen place-items-center bg-slate-50 px-4 text-center text-slate-900">
        <div className="max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-600">
            Landing publica
          </p>
          <h1 className="text-3xl font-black">Landing indisponivel</h1>
          <p className="mt-4 text-slate-600">{pageState.message}</p>
        </div>
      </div>
    );
  }

  const { data } = pageState;
  const theme = getLandingTheme(data.theme ?? fallbackPublicLanding.theme);
  const style = getLandingThemeStyle(theme);
  const allSections = data.sections.length > 0 ? data.sections : fallbackPublicLanding.sections;
  const sections = allSections.filter((section) => section.isActive);
  const businessName = data.landing.businessName || "SuaMarca";
  const title = data.seo?.metaTitle ?? `${businessName} | Atendimento profissional`;
  const description = data.seo?.metaDescription ?? data.landing.description;
  const logo = data.images.find((image) => image.type === "LOGO");

  const hero = getSectionWithFallback(sections, "HERO", fallbackPublicLanding.sections[0]);
  const about = getSectionWithFallback(sections, "ABOUT", fallbackPublicLanding.sections[1]);
  const benefits = getSectionWithFallback(sections, "BENEFITS", fallbackPublicLanding.sections[2]);
  const services =
    getSection(sections, "CUSTOM") ??
    ({ ...fallbackPublicLanding.sections[3], id: "services-fallback" } as LandingSection);
  const testimonials = getSectionWithFallback(
    sections,
    "TESTIMONIALS",
    fallbackPublicLanding.sections[4],
  );
  const cta = getSectionWithFallback(sections, "CTA", fallbackPublicLanding.sections[5]);
  const footer = getSectionWithFallback(sections, "FOOTER", fallbackPublicLanding.sections[6]);

  const heroImage = getSectionImage(data.images, hero, "HERO");
  const aboutImage =
    getSectionImage(data.images, about, "OTHER") ?? data.images.find((image) => image.type === "HERO");
  const featureTitles = splitContent(benefits.content);
  const serviceTitles = splitContent(services.content, "|");
  const testimonialItems = parseTestimonials(testimonials.content);
  const whatsappUrl = data.whatsapp?.isEnabled
    ? getWhatsAppUrl(data.whatsapp.phone, data.whatsapp.defaultMessage)
    : "#contato";

  const featureItems = featureFallbacks.map((fallback, index) => ({
    ...fallback,
    title: featureTitles[index] ?? fallback.title,
  }));
  const serviceItems = serviceFallbacks.map((fallback, index) => ({
    ...fallback,
    title: serviceTitles[index] ?? fallback.title,
  }));

  const activePrimary = theme.primaryColor || "#2563eb";
  const activeSecondary = theme.secondaryColor || "#1e40af";
  const accentStyle = {
    "--landing-primary": activePrimary,
    "--landing-secondary": activeSecondary,
  } as React.CSSProperties;

  const contactItems = useMemo(
    () => [
      { label: "WhatsApp", value: data.whatsapp?.phone ?? "(11) 98765-4321", icon: MessageCircle },
      { label: "Telefone", value: "(11) 3456-7890", icon: Phone },
      { label: "E-mail", value: "contato@suamarca.com.br", icon: Mail },
      { label: "Endereco", value: "Rua das Flores, 123 - Sao Paulo, SP", icon: MapPin },
    ],
    [data.whatsapp?.phone],
  );

  return (
    <div
      className="min-h-screen overflow-x-hidden bg-white text-slate-900"
      style={{ ...style, ...accentStyle }}
    >
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="theme-color" content={activePrimary} />
        {data.seo?.ogTitle ? <meta property="og:title" content={data.seo.ogTitle} /> : null}
        {data.seo?.ogDescription ? (
          <meta property="og:description" content={data.seo.ogDescription} />
        ) : null}
        {data.seo?.ogImage ? <meta property="og:image" content={data.seo.ogImage} /> : null}
        {data.seo?.canonicalUrl ? <link rel="canonical" href={data.seo.canonicalUrl} /> : null}
      </Helmet>

      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <a className="min-w-0" href="#inicio" aria-label="Voltar ao inicio">
            <BrandMark logo={logo} name={businessName} />
          </a>
          <nav className="hidden items-center gap-8 text-sm font-bold text-slate-700 lg:flex">
            {["Inicio", "Sobre", "Servicos", "Depoimentos", "FAQ", "Contato"].map((item) => (
              <a
                className="border-b-2 border-transparent py-2 transition hover:border-blue-600 hover:text-blue-600"
                href={`#${item === "Inicio" ? "inicio" : item.toLowerCase()}`}
                key={item}
              >
                {item}
              </a>
            ))}
          </nav>
          <a
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
            href="#contato"
            style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
          >
            <CalendarDays size={17} />
            <span className="hidden sm:inline">{hero.buttonLabel ?? "Agendar agora"}</span>
            <span className="sm:hidden">Agendar</span>
          </a>
        </div>
      </header>

      <main>
        <section id="inicio" className="bg-gradient-to-b from-slate-50 to-white">
          <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
            <div>
              <h1 className="max-w-2xl text-4xl font-black leading-tight tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                {hero.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                {hero.content}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <a
                  className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
                  href="#contato"
                  style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
                >
                  <CalendarDays size={18} />
                  {hero.buttonLabel ?? "Agendar agora"}
                </a>
                <a className="inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white px-6 py-4 text-sm font-black text-blue-700 transition hover:-translate-y-0.5 hover:bg-blue-50" href="#sobre">
                  Saiba mais
                  <ArrowRight size={18} />
                </a>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-slate-200 bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-500">
                <CheckCircle2 size={15} className="text-blue-600" />
                Textos e imagens personalizaveis pelo administrador
              </div>
            </div>

            <div className="relative min-h-[360px]">
              <div className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white via-white/80 to-transparent lg:block" />
              {heroImage ? (
                <img
                  alt={heroImage.alt}
                  className="h-[360px] w-full rounded-2xl object-cover shadow-xl shadow-slate-200 sm:h-[460px] lg:rounded-none lg:shadow-none"
                  loading="eager"
                  src={getImageUrl(heroImage.url)}
                />
              ) : (
                <div className="grid h-[360px] w-full place-items-center rounded-2xl border border-blue-100 bg-[radial-gradient(circle_at_20%_20%,#dbeafe,transparent_30%),linear-gradient(135deg,#eff6ff,#ffffff_45%,#dbeafe)] p-8 text-center shadow-xl shadow-slate-200 sm:h-[460px] lg:rounded-none lg:shadow-none">
                  <div className="max-w-sm rounded-2xl border border-white bg-white/80 p-6 shadow-lg backdrop-blur">
                    <Sparkles className="mx-auto text-blue-600" size={42} />
                    <strong className="mt-4 block text-2xl text-slate-950">{businessName}</strong>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      Adicione sua imagem principal pelo painel administrativo.
                    </p>
                  </div>
                </div>
              )}
              <div className="absolute right-4 top-8 w-48 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-2xl shadow-slate-300/70 backdrop-blur sm:right-8 sm:w-56">
                <h3 className="text-sm font-black text-slate-950">Proximos horarios</h3>
                {[
                  ["Hoje", "14:00"],
                  ["Amanha", "09:00"],
                  ["Quarta", "16:00"],
                  ["Quinta", "10:00"],
                ].map(([day, hour]) => (
                  <div className="mt-3 flex items-center justify-between gap-3 text-sm" key={day}>
                    <span className="font-semibold text-slate-500">{day}</span>
                    <span className="rounded-md border border-blue-100 bg-blue-50 px-3 py-1 font-black text-blue-700">
                      {hour}
                    </span>
                  </div>
                ))}
                <a
                  className="mt-4 inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-3 py-2 text-xs font-black text-white transition hover:bg-blue-700"
                  href="#contato"
                >
                  Ver mais horarios
                </a>
              </div>
            </div>
          </div>
        </section>

        <section className="px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {featureItems.map((item) => {
              const Icon = item.icon;
              return (
                <article
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  key={item.title}
                >
                  <Icon className="text-blue-600" size={38} strokeWidth={1.8} />
                  <h3 className="mt-4 text-base font-black text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </article>
              );
            })}
          </div>
        </section>

        <section id="sobre" className="px-4 py-12 sm:px-6">
          <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[0.9fr_1fr]">
            <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100 shadow-sm">
              {aboutImage ? (
                <img
                  alt={aboutImage.alt}
                  className="aspect-[16/10] w-full object-cover"
                  loading="lazy"
                  src={getImageUrl(aboutImage.url)}
                />
              ) : (
                <div className="grid aspect-[16/10] place-items-center bg-[radial-gradient(circle_at_30%_20%,#dbeafe,transparent_32%),linear-gradient(135deg,#f8fafc,#ffffff,#dbeafe)]">
                  <Users className="text-blue-600" size={56} strokeWidth={1.6} />
                </div>
              )}
            </div>
            <div>
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {about.title}
              </h2>
              <p className="mt-5 text-base leading-8 text-slate-600">{about.content}</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ["Experiencia comprovada", ShieldCheck],
                  ["Atendimento individualizado", Users],
                  ["Compromisso com resultados", Trophy],
                ].map(([label, Icon]) => (
                  <div className="flex items-center gap-3" key={label as string}>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-blue-50 text-blue-600">
                      <Icon size={20} />
                    </span>
                    <strong className="text-sm text-slate-800">{label as string}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="servicos" className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-7xl rounded-lg border border-slate-200 bg-slate-50/70 p-5 shadow-sm sm:p-8">
            <div className="mx-auto mb-8 max-w-2xl text-center">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {services.title || "Nossos servicos"}
              </h2>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {services.subtitle || "Solucoes personalizadas para atender o que voce precisa."}
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {serviceItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article
                    className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
                    key={item.title}
                  >
                    <Icon className="mx-auto text-blue-600" size={34} strokeWidth={1.9} />
                    <h3 className="mt-4 text-sm font-black text-slate-950">{item.title}</h3>
                    <p className="mt-3 text-xs leading-5 text-slate-600">{item.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl text-center">
            <h2 className="text-3xl font-black tracking-tight text-slate-950">Como funciona</h2>
            <p className="mt-2 text-sm text-slate-600">Um processo simples para cuidar de voce.</p>
            <div className="mt-8 grid gap-6 md:grid-cols-3">
              {[
                ["Escolha o servico", "Veja as opcoes de servicos e escolha o ideal para voce."],
                ["Agende seu horario", "Escolha a data e o horario que melhor se encaixam na sua rotina."],
                ["Receba seu atendimento", "Seja bem atendido e receba todo o cuidado que voce merece."],
              ].map(([stepTitle, stepText], index) => (
                <article className="relative rounded-lg bg-white p-5 text-left" key={stepTitle}>
                  <span className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-blue-100 bg-blue-50 text-xl font-black text-blue-700 md:mx-0">
                    {index + 1}
                  </span>
                  <h3 className="mt-4 font-black text-slate-950">{stepTitle}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{stepText}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="depoimentos" className="bg-white px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-center text-3xl font-black tracking-tight text-slate-950">
              {testimonials.title || "O que nossos clientes dizem"}
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {testimonialItems.slice(0, 3).map((testimonial) => (
                <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm" key={testimonial.name}>
                  <Quote className="text-blue-600" size={24} />
                  <p className="mt-3 text-sm leading-7 text-slate-600">{testimonial.text}</p>
                  <div className="mt-6 flex items-center gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-full bg-blue-100 font-black text-blue-700">
                      {testimonial.name.slice(0, 1)}
                    </span>
                    <div>
                      <strong className="block text-sm text-slate-950">{testimonial.name}</strong>
                      <span className="text-xs text-slate-500">{testimonial.role}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-5 flex justify-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
              <span className="h-2 w-2 rounded-full bg-slate-300" />
            </div>
          </div>
        </section>

        <section id="faq" className="px-4 py-12 sm:px-6">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-center text-3xl font-black tracking-tight text-slate-950">
              Perguntas frequentes
            </h2>
            <div className="mt-8 grid gap-3 md:grid-cols-2">
              {faqItems.map((item, index) => (
                <details
                  className="group rounded-lg border border-slate-200 bg-white p-4 shadow-sm open:border-blue-200"
                  key={item.question}
                  open={index === 0}
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-black text-slate-900">
                    {item.question}
                    <ChevronDown className="shrink-0 text-slate-400 transition group-open:rotate-180" size={18} />
                  </summary>
                  <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-5 rounded-lg border border-blue-200 bg-blue-50 px-6 py-6 shadow-sm md:flex-row md:justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-950">{cta.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{cta.subtitle}</p>
            </div>
            <a
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-blue-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5"
              href="#contato"
            >
              <CalendarDays size={18} />
              {cta.buttonLabel ?? "Agendar agora"}
            </a>
          </div>
        </section>

        <section id="contato" className="px-4 py-8 sm:px-6">
          <div className="mx-auto grid max-w-6xl gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 lg:grid-cols-5">
            {contactItems.map((item) => {
              const Icon = item.icon;
              return (
                <div className="flex items-center gap-3 rounded-lg bg-white p-3" key={item.label}>
                  <Icon className="shrink-0 text-blue-600" size={28} strokeWidth={1.8} />
                  <div className="min-w-0">
                    <strong className="block text-sm text-slate-950">{item.label}</strong>
                    <span className="block truncate text-xs text-slate-600">{item.value}</span>
                  </div>
                </div>
              );
            })}
            <div className="flex items-center gap-4 rounded-lg bg-white p-3">
              <span className="text-sm font-black text-slate-950">Siga nas redes</span>
              <Share2 className="text-slate-800" size={20} />
              <Network className="text-slate-800" size={20} />
              <MessageCircle className="text-slate-800" size={20} />
            </div>
          </div>

          <div className="mx-auto mt-8 grid max-w-6xl gap-8 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-2xl font-black text-slate-950">Fale conosco</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                Preencha o formulario e retornaremos em breve. Voce tambem pode chamar pelo WhatsApp.
              </p>
              {data.whatsapp?.isEnabled ? (
                <a
                  className="mt-5 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 bg-white px-5 py-3 text-sm font-black text-blue-700 transition hover:bg-blue-50"
                  href={whatsappUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  <MessageCircle size={18} />
                  {data.whatsapp.buttonLabel || "Entrar em contato"}
                </a>
              ) : null}
            </div>
            <form className="grid gap-4 rounded-lg border border-slate-200 bg-white p-6 shadow-sm" onSubmit={handleSubmit}>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Nome</span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    onChange={(event) => setForm({ ...form, name: event.target.value })}
                    placeholder="Seu nome"
                    type="text"
                    value={form.name}
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Telefone</span>
                  <input
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                    onChange={(event) => setForm({ ...form, phone: event.target.value })}
                    placeholder="Seu telefone"
                    type="tel"
                    value={form.phone}
                  />
                </label>
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">E-mail</span>
                <input
                  className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  onChange={(event) => setForm({ ...form, email: event.target.value })}
                  placeholder="contato@exemplo.com"
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
              <label className="block">
                <span className="mb-2 block text-sm font-bold text-slate-700">Mensagem</span>
                <textarea
                  className="min-h-28 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                  onChange={(event) => setForm({ ...form, message: event.target.value })}
                  placeholder="Conte como podemos ajudar"
                  value={form.message}
                />
              </label>
              <button
                className="rounded-lg px-5 py-3 text-sm font-black text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
                disabled={isSubmitting}
                style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
                type="submit"
              >
                {isSubmitting ? "Enviando..." : "Enviar mensagem"}
              </button>
              {feedback ? <p className="text-sm font-semibold text-green-700">{feedback}</p> : null}
              {error ? <p className="text-sm font-semibold text-red-700">{error}</p> : null}
            </form>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-10 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 md:grid-cols-5">
          <div className="md:col-span-2">
            <BrandMark logo={logo} name={footer.title || businessName} />
            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-600">
              {footer.content || "Cuidado, atencao e resultados para o que mais importa: voce."}
            </p>
            <p className="mt-8 text-xs text-slate-500">
              © {new Date().getFullYear()} {businessName}. Todos os direitos reservados.
            </p>
          </div>
          <div className="text-sm leading-8 text-slate-600">
            <strong className="block text-slate-950">Navegacao</strong>
            <a className="block hover:text-blue-600" href="#inicio">Inicio</a>
            <a className="block hover:text-blue-600" href="#sobre">Sobre</a>
            <a className="block hover:text-blue-600" href="#servicos">Servicos</a>
            <a className="block hover:text-blue-600" href="#depoimentos">Depoimentos</a>
          </div>
          <div className="text-sm leading-8 text-slate-600">
            <strong className="block text-slate-950">Servicos</strong>
            {serviceItems.slice(0, 5).map((item) => (
              <span className="block" key={item.title}>{item.title}</span>
            ))}
          </div>
          <div className="text-sm leading-8 text-slate-600">
            <strong className="block text-slate-950">Ajuda</strong>
            <a className="block hover:text-blue-600" href="#faq">FAQ</a>
            <span className="block">Politica de Privacidade</span>
            <span className="block">Termos de Uso</span>
            <a
              className="mt-4 inline-flex items-center justify-center gap-2 rounded-lg border border-blue-600 px-4 py-2 text-sm font-black text-blue-700 hover:bg-blue-50"
              href="#contato"
            >
              <MessageCircle size={16} />
              Entrar em contato
            </a>
          </div>
        </div>
      </footer>

      <WhatsAppFloatingButton whatsapp={data.whatsapp} theme={theme} />
    </div>
  );
}
