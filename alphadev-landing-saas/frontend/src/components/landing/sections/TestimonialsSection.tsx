import { splitLandingContent } from "../../../utils/landingContent";
import { getImageUrl } from "../../../utils/getImageUrl";
import type { LandingSectionProps } from "./types";

export function TestimonialsSection({ section, images, theme }: LandingSectionProps) {
  const testimonials = splitLandingContent(section.content, "|");
  const testimonialImages = images.filter((image) => image.type === "TESTIMONIAL");

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.24em]"
            style={{ color: theme.primaryColor }}
          >
            Depoimentos
          </p>
          <h2 className="text-3xl font-black sm:text-4xl">{section.title}</h2>
          {section.subtitle ? <p className="mt-4 opacity-75">{section.subtitle}</p> : null}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial}
              className="rounded-lg border border-white/10 bg-white/[0.04] p-6"
            >
              {testimonialImages[index] ? (
                <img
                  className="mb-5 h-16 w-16 rounded-full object-cover"
                  src={getImageUrl(testimonialImages[index].url)}
                  alt={testimonialImages[index].alt}
                />
              ) : null}
              <p className="leading-7 opacity-80">"{testimonial}"</p>
              <strong className="mt-5 block">Cliente {index + 1}</strong>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
