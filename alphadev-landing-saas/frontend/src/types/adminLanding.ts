import type {
  LandingSection,
  LandingSectionType,
  LandingTheme,
  SeoConfig,
  WhatsAppConfig,
} from "./landing";

export type LandingStatus = "DRAFT" | "PUBLISHED" | "SUSPENDED" | "BLOCKED";

export type AdminLanding = {
  id: string;
  name: string;
  slug: string;
  businessName: string;
  description: string;
  status: LandingStatus;
  plan: "BASIC" | "PRO" | "PREMIUM";
  createdAt: string;
  updatedAt: string;
  theme: (LandingTheme & { id: string }) | null;
  sections: LandingSection[];
  whatsappConfig: (WhatsAppConfig & { id: string }) | null;
  seoConfig: (SeoConfig & { id: string }) | null;
  subscription: {
    id: string;
    status: "ACTIVE" | "LATE" | "SUSPENDED" | "CANCELED";
    startedAt: string;
    dueDay: number;
    lastPaymentAt: string | null;
    nextPaymentAt: string | null;
    blockedAt: string | null;
  } | null;
};

export type AdminLandingResponse = {
  landing: AdminLanding;
};

export type UpdateLandingMainPayload = {
  name: string;
  slug: string;
  businessName: string;
  description: string;
  status: LandingStatus;
};

export type UpdateThemePayload = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
};

export type UpdateWhatsappPayload = {
  phone: string;
  defaultMessage: string;
  buttonLabel: string;
  isEnabled: boolean;
};

export type UpdateSeoPayload = {
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
};

export type LandingSectionPayload = {
  type: LandingSectionType;
  title: string;
  subtitle?: string;
  content?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  order: number;
  isActive: boolean;
};
