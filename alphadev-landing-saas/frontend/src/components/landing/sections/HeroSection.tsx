import { getWhatsAppUrl } from "../../../utils/landingContent";
import { getImageUrl } from "../../../utils/getImageUrl";
import type { LandingSectionProps } from "./types";

export function HeroSection({ section, images, theme, whatsapp }: LandingSectionProps) {
  const heroImage = images.find((image) => image.type === "HERO") ?? images[0];
  const buttonUrl =
    section.buttonUrl ??
    (whatsapp ? getWhatsAppUrl(whatsapp.phone, whatsapp.defaultMessage) : "#");

  return (
    <section
      className="overflow-hidden"
      style={{
        background: `linear-gradient(180deg, ${theme.backgroundColor} 0%, ${theme.secondaryColor} 100%)`,
      }}
    >
      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1fr_0.95fr] lg:py-20">
        <div className="animate-[fadeIn_0.7s_ease-out]">
          {section.subtitle ? (
            <p
              className="mb-4 text-xs font-bold uppercase tracking-[0.26em] sm:text-sm"
              style={{ color: theme.primaryColor }}
            >
              {section.subtitle}
            </p>
          ) : null}

          <h1 className="max-w-3xl text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {section.title}
          </h1>

          {section.content ? (
            <p className="mt-6 max-w-2xl text-base leading-8 opacity-80 sm:text-lg">
              {section.content}
            </p>
          ) : null}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href={buttonUrl}
              target={buttonUrl.startsWith("#") ? undefined : "_blank"}
              rel="noreferrer"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-bold shadow-lg shadow-blue-500/20 transition hover:-translate-y-0.5 hover:brightness-110"
              style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
              }}
            >
              {whatsapp?.buttonLabel ?? section.buttonLabel ?? "Falar agora"}
            </a>
          </div>
        </div>

        {heroImage ? (
          <div className="animate-[fadeIn_0.9s_ease-out] rounded-lg border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-200/70">
            <img
              className="aspect-[4/3] w-full rounded-lg object-cover"
              src={getImageUrl(heroImage.url)}
              alt={heroImage.alt}
              loading="eager"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}
