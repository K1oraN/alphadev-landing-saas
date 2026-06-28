import { getWhatsAppUrl } from "../../utils/landingContent";
import type { LandingTheme, WhatsAppConfig } from "../../types/landing";

type WhatsAppFloatingButtonProps = {
  whatsapp: WhatsAppConfig | null;
  theme: LandingTheme;
};

export function WhatsAppFloatingButton({ whatsapp, theme }: WhatsAppFloatingButtonProps) {
  if (!whatsapp?.isEnabled) {
    return null;
  }

  return (
    <a
      href={getWhatsAppUrl(whatsapp.phone, whatsapp.defaultMessage)}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-4 right-4 z-40 inline-flex max-w-[calc(100vw-2rem)] items-center justify-center rounded-full px-5 py-3 text-sm font-bold shadow-2xl transition hover:brightness-110 sm:bottom-6 sm:right-6"
      style={{
        backgroundColor: theme.buttonColor,
        color: theme.buttonTextColor,
        boxShadow: `0 12px 34px ${theme.primaryColor}55`,
      }}
    >
      {whatsapp.buttonLabel}
    </a>
  );
}
