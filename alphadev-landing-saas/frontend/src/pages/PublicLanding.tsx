import { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { LandingSectionRenderer } from "../components/landing/LandingSectionRenderer";
import { WhatsAppFloatingButton } from "../components/landing/WhatsAppFloatingButton";
import {
  getMainPublicLanding,
  getPublicLandingBySlug,
} from "../services/publicLandingService";
import type { PublicLandingResponse } from "../types/landing";
import { getImageUrl } from "../utils/getImageUrl";
import { getLandingTheme, getLandingThemeStyle } from "../utils/landingTheme";

const fallbackPublicLanding: PublicLandingResponse = {
  landing: {
    id: "fallback-main",
    name: "Landing Principal",
    slug: "principal",
    businessName: "Sua Empresa",
    description:
      "Uma landing page moderna, rapida e personalizavel para apresentar sua empresa, seus servicos e captar novos contatos.",
  },
  theme: {
    primaryColor: "#2563eb",
    secondaryColor: "#f8fafc",
    backgroundColor: "#ffffff",
    textColor: "#0f172a",
    buttonColor: "#2563eb",
    buttonTextColor: "#ffffff",
    fontFamily: "Inter",
  },
  sections: [
    {
      id: "hero",
      type: "HERO",
      title: "Transforme visitantes em clientes",
      subtitle: "Sua Empresa",
      content:
        "Uma pagina moderna, clara e objetiva para apresentar sua empresa, destacar seus diferenciais e receber contatos qualificados.",
      buttonLabel: "Fale conosco",
      buttonUrl: "#contato",
      order: 1,
      isActive: true,
    },
    {
      id: "about",
      type: "ABOUT",
      title: "Sobre a empresa",
      subtitle: "Apresente sua historia com clareza",
      content:
        "Use este espaco para contar quem voce e, o que sua empresa faz e por que seus clientes devem confiar no seu trabalho.",
      buttonLabel: null,
      buttonUrl: null,
      order: 2,
      isActive: true,
    },
    {
      id: "benefits",
      type: "BENEFITS",
      title: "Por que escolher nossa solucao?",
      subtitle: "Diferenciais que ajudam sua empresa a vender melhor",
      content:
        "Atendimento personalizado; apresentacao profissional; facil contato; experiencia otimizada em qualquer dispositivo.",
      buttonLabel: null,
      buttonUrl: null,
      order: 3,
      isActive: true,
    },
    {
      id: "gallery",
      type: "GALLERY",
      title: "Galeria",
      subtitle: "Mostre produtos, equipe, espacos ou resultados",
      content: "Adicione imagens no painel para deixar sua landing mais visual e confiavel.",
      buttonLabel: null,
      buttonUrl: null,
      order: 4,
      isActive: true,
    },
    {
      id: "testimonials",
      type: "TESTIMONIALS",
      title: "Depoimentos",
      subtitle: "Confianca construida com bons resultados",
      content:
        "Atendimento claro, rapido e muito profissional.|A pagina facilitou o contato e deixou a apresentacao mais completa.|Experiencia simples, bonita e objetiva em qualquer dispositivo.",
      buttonLabel: null,
      buttonUrl: null,
      order: 5,
      isActive: true,
    },
    {
      id: "cta",
      type: "CTA",
      title: "Pronto para comecar?",
      subtitle: "Entre em contato e descubra como podemos ajudar.",
      content:
        "Preencha o formulario ou chame pelo WhatsApp. Sua equipe pode personalizar este texto pelo painel.",
      buttonLabel: "Solicitar atendimento",
      buttonUrl: "#contato",
      order: 6,
      isActive: true,
    },
    {
      id: "footer",
      type: "FOOTER",
      title: "Sua Empresa",
      subtitle: null,
      content: "Uma landing moderna, clara e pronta para ser personalizada.",
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
      "Ola! Vim pela landing da Sua Empresa e gostaria de receber atendimento.",
    buttonLabel: "Chamar no WhatsApp",
    isEnabled: true,
  },
  seo: {
    metaTitle: "Sua Empresa | Landing Page",
    metaDescription: "Conheca nossa empresa, nossos servicos e fale conosco de forma rapida e simples.",
    ogTitle: "Sua Empresa",
    ogDescription: "Uma pagina moderna para apresentar servicos, diferenciais e canais de contato.",
    ogImage:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    canonicalUrl: null,
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
      setPageState({ status: "loading" });

      try {
        const data = slug ? await getPublicLandingBySlug(slug) : await getMainPublicLanding();
        setPageState({ status: "ready", data, isFallback: false });
      } catch (error) {
        if (isAxiosError(error) && error.response?.status === 404) {
          if (!slug) {
            setPageState({
              status: "ready",
              data: fallbackPublicLanding,
              isFallback: true,
            });
            return;
          }

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
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center text-slate-900">
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
          Carregando landing...
        </p>
      </div>
    );
  }

  if (pageState.status === "not-found" || pageState.status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-4 text-center text-slate-900">
        <div className="max-w-md">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.24em] text-blue-600">
            Landing publica
          </p>
          <h1 className="text-3xl font-black">Landing indisponivel</h1>
          <p className="mt-4 text-slate-600">{pageState.message}</p>
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
        <meta name="theme-color" content={theme.primaryColor} />
        {data.seo?.ogTitle ? <meta property="og:title" content={data.seo.ogTitle} /> : null}
        {data.seo?.ogDescription ? (
          <meta property="og:description" content={data.seo.ogDescription} />
        ) : null}
        {data.seo?.ogImage ? <meta property="og:image" content={data.seo.ogImage} /> : null}
        {data.seo?.canonicalUrl ? <link rel="canonical" href={data.seo.canonicalUrl} /> : null}
      </Helmet>

      {isFallback ? (
        <div className="border-b border-blue-100 bg-blue-50 px-4 py-3 text-center text-sm text-blue-800">
          Exibindo uma landing padrao enquanto a landing principal nao esta configurada no banco.
        </div>
      ) : null}

      <header
        className="sticky top-0 z-20 border-b border-slate-200/70 px-4 py-4 backdrop-blur sm:px-6"
        style={{ backgroundColor: `${theme.backgroundColor}ee`, color: theme.textColor }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-sm font-black text-white shadow-sm"
              style={{ backgroundColor: theme.primaryColor }}
            >
              {data.landing.businessName.slice(0, 1).toUpperCase()}
            </span>
            {logo ? (
              <img
                className="max-h-12 max-w-40 object-contain"
                src={getImageUrl(logo.url)}
                alt={logo.alt}
                loading="eager"
              />
            ) : (
              <span className="truncate text-sm font-bold sm:text-base">
                {data.landing.businessName}
              </span>
            )}
          </div>
          <a
            className="inline-flex shrink-0 items-center justify-center rounded-lg px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            href="#contato"
            style={{ backgroundColor: theme.buttonColor, color: theme.buttonTextColor }}
          >
            Contato
          </a>
        </div>
      </header>

      {data.sections.map((section) => (
        <LandingSectionRenderer
          key={section.id}
          section={section}
          images={data.images}
          landingSlug={data.landing.slug}
          theme={theme}
          whatsapp={data.whatsapp}
        />
      ))}

      <WhatsAppFloatingButton whatsapp={data.whatsapp} theme={theme} />
    </div>
  );
}
