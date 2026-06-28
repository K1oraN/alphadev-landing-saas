import type {
  LandingImage,
  LandingSection,
  LandingTheme,
  WhatsAppConfig,
} from "../../../types/landing";

export type LandingSectionProps = {
  section: LandingSection;
  images: LandingImage[];
  theme: LandingTheme;
  whatsapp: WhatsAppConfig | null;
};
