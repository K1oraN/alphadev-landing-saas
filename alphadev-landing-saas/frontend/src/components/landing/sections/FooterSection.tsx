import type { LandingSectionProps } from "./types";

export function FooterSection({ section, theme }: LandingSectionProps) {
  return (
    <footer className="border-t border-white/10 px-4 py-8 text-center text-sm opacity-75">
      <strong className="block text-base opacity-100">{section.title}</strong>
      {section.content ? <span className="mt-2 block">{section.content}</span> : null}
      <span className="mt-4 block" style={{ color: theme.primaryColor }}>
        AlphaDev Landing SaaS
      </span>
    </footer>
  );
}
