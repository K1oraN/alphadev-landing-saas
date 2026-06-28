import { getImageUrl } from "../../../utils/getImageUrl";
import type { LandingSectionProps } from "./types";

export function AboutSection({ section, images, theme }: LandingSectionProps) {
  const sectionImage =
    images.find((image) => image.sectionId === section.id) ??
    images.find((image) => image.type === "OTHER");

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        {sectionImage ? (
          <img
            className="aspect-[4/3] w-full rounded-lg object-cover"
            src={getImageUrl(sectionImage.url)}
            alt={sectionImage.alt}
            loading="lazy"
          />
        ) : null}

        <div>
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.24em]"
            style={{ color: theme.primaryColor }}
          >
            Sobre
          </p>
          <h2 className="text-3xl font-black sm:text-4xl">{section.title}</h2>
          {section.subtitle ? (
            <p className="mt-4 text-lg font-semibold opacity-90">{section.subtitle}</p>
          ) : null}
          {section.content ? (
            <p className="mt-5 text-base leading-8 opacity-75">{section.content}</p>
          ) : null}
        </div>
      </div>
    </section>
  );
}
