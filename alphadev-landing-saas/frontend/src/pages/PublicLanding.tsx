import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import { LandingSectionRenderer } from "../components/landing/LandingSectionRenderer";
import { WhatsAppFloatingButton } from "../components/landing/WhatsAppFloatingButton";
import { getPublicLandingBySlug } from "../services/publicLandingService";
import type { PublicLandingResponse } from "../types/landing";
import { getImageUrl } from "../utils/getImageUrl";
import { getLandingTheme, getLandingThemeStyle } from "../utils/landingTheme";

const fallbackPublicLanding: PublicLandingResponse = {
  landing: {
    id: "mock-demo",
    name: "Landing Barbearia Demo",
    slug: "barbearia-demo",
    businessName: "Barbearia Demo AlphaDev",
    description:
      "Barbearia premium com atendimento agendado, cortes modernos, barba alinhada e experiencia completa.",
  },
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
        "Agendamento rapido; profissionais experientes; ambiente confortavel; atendimento personalizado",
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
        "Atendimento impecavel e corte muito bem feito.|Melhor experiencia de barbearia da regiao.|Agendei pelo WhatsApp e fui atendido no horario combinado.",
      buttonLabel: null,
      buttonUrl: null,
      order: 4,
      isActive: true,
    },
    {
      id: "gallery",
      type: "GALLERY",
      title: "Galeria",
      subtitle: "Ambiente, acabamento e estilo",
      content: "Imagens demonstrativas da landing publica.",
      buttonLabel: null,
      buttonUrl: null,
      order: 5,
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
      order: 6,
      isActive: true,
    },
    {
      id: "footer",
      type: "FOOTER",
      title: "Barbearia Demo AlphaDev",
      subtitle: null,
      content: "Rua Demo, 123 - Centro. Atendimento de segunda a sabado.",
      buttonLabel: null,
      buttonUrl: null,
      order: 7,
      isActive: true,
    },
  ],
  images: [
    {
      id: "hero-image",
      sectionId: "hero",
      url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
      alt: "Barbeiro fazendo acabamento em cliente",
      type: "HERO",
      order: 1,
    },
    {
      id: "gallery-1",
      sectionId: "gallery",
      url: "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=900&q=80",
      alt: "Barbeiro aparando barba",
      type: "GALLERY",
      order: 1,
    },
    {
      id: "gallery-2",
      sectionId: "gallery",
      url: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=80",
      alt: "Ferramentas de barbearia",
      type: "GALLERY",
      order: 2,
    },
    {
      id: "gallery-3",
      sectionId: "gallery",
      url: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=900&q=80",
      alt: "Cliente recebendo corte de cabelo",
      type: "GALLERY",
      order: 3,
    },
  ],
  whatsapp: {
    phone: "5511999999999",
    defaultMessage:
      "Ola! Vim pela landing da Barbearia Demo AlphaDev e quero agendar um horario.",
    buttonLabel: "Agendar pelo WhatsApp",
    isEnabled: true,
  },
  seo: {
    metaTitle: "Barbearia Demo AlphaDev | Corte e barba com agendamento",
    metaDescription: "Landing demo de barbearia criada para o AlphaDev Landing SaaS.",
    ogTitle: "Barbearia Demo AlphaDev",
    ogDescription: "Cortes modernos, barba alinhada e atendimento profissional.",
    ogImage:
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
    canonicalUrl: "https://barbearia-demo.alphadev.com.br",
  },
};

type PageState =
  | { status: "loading" }
  | { status: "ready"; data: PublicLandingResponse; isFallback: boolean }
  | { status: "not-found"; message: string }
  | { status: "error"; message: string };

export function PublicLanding() {
  const { slug } = useParams<{ slug: string }>();
  const [pageState, setPageState] = useState<PageState>({ status: "loading" });

  useEffect(() => {
    async function loadLanding() {
      if (!slug) {
        setPageState({
          status: "not-found",
          message: "Landing nao encontrada.",
        });
        return;
      }

      setPageState({ status: "loading" });

      try {
        const data = await getPublicLandingBySlug(slug);
        setPageState({ status: "ready", data, isFallback: false });
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          setPageState({
            status: "not-found",
            message: "Landing publica nao encontrada ou indisponivel.",
          });
          return;
        }

        if (import.meta.env.DEV) {
          setPageState({
            status: "ready",
            data: fallbackPublicLanding,
            isFallback: true,
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

  if (pageState.status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-alpha-dark px-4 text-center text-slate-50">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-alpha-red">
          Carregando landing...
        </p>
      </div>
    );
  }

  if (pageState.status === "not-found" || pageState.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-alpha-dark px-4 text-center text-slate-50">
        <div className="max-w-md">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-alpha-red">
            AlphaDev Landing SaaS
          </p>
          <h1 className="text-3xl font-black">Landing indisponivel</h1>
          <p className="mt-4 text-slate-300">{pageState.message}</p>
          <Link
            className="mt-6 inline-flex rounded-lg bg-alpha-red px-5 py-3 text-sm font-bold text-white"
            to="/"
          >
            Voltar ao inicio
          </Link>
        </div>
      </div>
    );
  }

  const { data, isFallback } = pageState;
  const theme = getLandingTheme(data.theme);
  const style = getLandingThemeStyle(theme);
  const title = data.seo?.metaTitle ?? data.landing.businessName;
  const description = data.seo?.metaDescription ?? data.landing.description;
  const logo = data.images.find((image) => image.type === "LOGO");

  return (
    <div className="min-h-screen overflow-x-hidden" style={style}>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {data.seo?.ogTitle ? <meta property="og:title" content={data.seo.ogTitle} /> : null}
        {data.seo?.ogDescription ? (
          <meta property="og:description" content={data.seo.ogDescription} />
        ) : null}
        {data.seo?.ogImage ? <meta property="og:image" content={data.seo.ogImage} /> : null}
        {data.seo?.canonicalUrl ? <link rel="canonical" href={data.seo.canonicalUrl} /> : null}
      </Helmet>

      {isFallback ? (
        <div className="border-b border-yellow-500/20 bg-yellow-500/10 px-4 py-3 text-center text-sm text-yellow-100">
          Ambiente de desenvolvimento usando fallback mockado. Inicie o backend para
          carregar dados reais pelo slug.
        </div>
      ) : null}

      {logo ? (
        <header className="border-b border-white/10 bg-black/25 px-4 py-4 sm:px-6">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
            <img
              className="max-h-14 max-w-44 object-contain"
              src={getImageUrl(logo.url)}
              alt={logo.alt}
            />
            <span className="text-sm font-semibold opacity-75">{data.landing.businessName}</span>
          </div>
        </header>
      ) : null}

      {data.sections.map((section) => (
        <LandingSectionRenderer
          key={section.id}
          section={section}
          images={data.images}
          theme={theme}
          whatsapp={data.whatsapp}
        />
      ))}

      <WhatsAppFloatingButton whatsapp={data.whatsapp} theme={theme} />
    </div>
  );
}
