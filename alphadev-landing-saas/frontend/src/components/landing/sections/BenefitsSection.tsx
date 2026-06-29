import { splitLandingContent } from "../../../utils/landingContent";
import type { LandingSectionProps } from "./types";

export function BenefitsSection({ section, theme }: LandingSectionProps) {
  const benefits = splitLandingContent(section.content);

  return (
    <section className="px-4 py-16 sm:px-6" style={{ backgroundColor: theme.secondaryColor }}>
      <div className="mx-auto max-w-6xl">
        <div className="mb-10 max-w-2xl">
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.24em]"
            style={{ color: theme.primaryColor }}
          >
            Beneficios
          </p>
          <h2 className="text-3xl font-black sm:text-4xl">{section.title}</h2>
          {section.subtitle ? <p className="mt-4 opacity-75">{section.subtitle}</p> : null}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <article
              key={benefit}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <span
                className="mb-5 block h-2 w-12 rounded-full"
                style={{ backgroundColor: theme.primaryColor }}
              />
              <h3 className="text-lg font-bold">{benefit}</h3>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
