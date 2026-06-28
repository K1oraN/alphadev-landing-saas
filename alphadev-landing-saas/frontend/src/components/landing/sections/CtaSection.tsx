import { useState } from "react";
import type { FormEvent } from "react";
import { useSearchParams } from "react-router-dom";
import { createLead } from "../../../services/publicLeadService";
import { getWhatsAppUrl } from "../../../utils/landingContent";
import type { LandingSectionProps } from "./types";

const initialForm = {
  name: "",
  phone: "",
  email: "",
  message: "",
  website: "",
};

export function CtaSection({ section, theme, whatsapp, landingSlug }: LandingSectionProps) {
  const [searchParams] = useSearchParams();
  const [form, setForm] = useState(initialForm);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const whatsappUrl =
    section.buttonUrl ??
    (whatsapp ? getWhatsAppUrl(whatsapp.phone, whatsapp.defaultMessage) : "#");

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
      await createLead(landingSlug, {
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
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            placeholder="Nome"
            type="text"
            value={form.name}
          />
          <input
            className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none placeholder:text-slate-500"
            onChange={(event) => setForm({ ...form, phone: event.target.value })}
            placeholder="Telefone"
            type="tel"
            value={form.phone}
          />
          <input
            className="w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none placeholder:text-slate-500"
            onChange={(event) => setForm({ ...form, email: event.target.value })}
            placeholder="E-mail"
            type="email"
            value={form.email}
          />
          <input
            aria-hidden="true"
            autoComplete="off"
            className="hidden"
            onChange={(event) => setForm({ ...form, website: event.target.value })}
            tabIndex={-1}
            type="text"
            value={form.website}
          />
          <textarea
            className="min-h-32 w-full rounded-lg border border-white/10 bg-black/25 px-4 py-3 outline-none placeholder:text-slate-500"
            onChange={(event) => setForm({ ...form, message: event.target.value })}
            placeholder="Mensagem"
            value={form.message}
          />
          <button
            className="w-full rounded-lg px-5 py-3 text-sm font-bold transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isSubmitting}
            style={{
              backgroundColor: theme.buttonColor,
              color: theme.buttonTextColor,
            }}
            type="submit"
          >
            {isSubmitting ? "Enviando..." : "Enviar mensagem"}
          </button>
          {feedback ? <p className="text-sm text-green-200">{feedback}</p> : null}
          {error ? <p className="text-sm text-red-200">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
