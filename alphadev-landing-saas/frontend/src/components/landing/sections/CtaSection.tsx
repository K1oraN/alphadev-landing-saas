import { useState } from "react";
import { getWhatsAppUrl } from "../../../utils/landingContent";
import type { LandingSectionProps } from "./types";

export function CtaSection({ section, theme, whatsapp }: LandingSectionProps) {
  const [message, setMessage] = useState("");
  const whatsappUrl =
    section.buttonUrl ??
    (whatsapp ? getWhatsAppUrl(whatsapp.phone, whatsapp.defaultMessage) : "#");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(
      "Formulario visual nesta etapa. O salvamento de leads sera implementado na proxima etapa.",
    );
  }

  return (
    <section className="px-4 py-16 sm:px-6 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <p
            className="mb-3 text-xs font-bold uppercase tracking-[0.24em]"
            style={{ color: theme.primaryColor }}
          >
            Contato
          </p>
          <h2 className="text-3xl font-black sm:text-4xl">{section.title}</h2>
          {section.subtitle ? <p className="mt-4 text-lg font-semibold">{section.subtitle}</p> : null}
          {section.content ? <p className="mt-5 leading-8 opacity-75">{section.content}</p> : null}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex w-full items-center justify-center rounded-lg px-5 py-3 text-sm font-bold transition hover:brightness-110 sm:w-auto"
            style={{
              backgroundColor: theme.buttonColor,
              color: theme.buttonTextColor,
            }}
          >
            {whatsapp?.buttonLabel ?? section.buttonLabel ?? "Chamar no WhatsApp"}
          </a>
        </div>

        <form
          className="space-y-4 rounded-lg border border-white/10 bg-white/[0.04] p-5"
          onSubmit={handleSubmit}
        >
          <input
            className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none placeholder:text-slate-500"
            placeholder="Nome"
            type="text"
          />
          <input
            className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none placeholder:text-slate-500"
            placeholder="Telefone"
            type="tel"
          />
          <input
            className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none placeholder:text-slate-500"
            placeholder="E-mail"
            type="email"
          />
          <textarea
            className="min-h-32 w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none placeholder:text-slate-500"
            placeholder="Mensagem"
          />
          <button
            className="w-full rounded-lg px-5 py-3 text-sm font-bold transition hover:brightness-110"
            style={{
              backgroundColor: theme.buttonColor,
              color: theme.buttonTextColor,
            }}
            type="submit"
          >
            Enviar mensagem
          </button>
          {message ? <p className="text-sm opacity-75">{message}</p> : null}
        </form>
      </div>
    </section>
  );
}
