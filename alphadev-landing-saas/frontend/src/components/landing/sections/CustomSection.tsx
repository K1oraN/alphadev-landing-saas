import type { LandingSectionProps } from "./types";

export function CustomSection({ section, theme }: LandingSectionProps) {
  return (
    <section className="px-4 py-16 sm:px-6" style={{ backgroundColor: theme.secondaryColor }}>
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-black sm:text-4xl">{section.title}</h2>
        {section.subtitle ? <p className="mt-4 text-lg font-semibold">{section.subtitle}</p> : null}
        {section.content ? <p className="mt-5 leading-8 opacity-75">{section.content}</p> : null}
      </div>
    </section>
  );
}
