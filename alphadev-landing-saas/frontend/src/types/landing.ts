export type LandingSectionType =
  | "HERO"
  | "ABOUT"
  | "BENEFITS"
  | "TESTIMONIALS"
  | "GALLERY"
  | "CTA"
  | "FOOTER"
  | "CUSTOM";

export type LandingImageType = "LOGO" | "HERO" | "GALLERY" | "TESTIMONIAL" | "OTHER";

export type LandingTheme = {
  primaryColor: string;
  secondaryColor: string;
  backgroundColor: string;
  textColor: string;
  buttonColor: string;
  buttonTextColor: string;
  fontFamily: string;
};

export type LandingSection = {
  id: string;
  type: LandingSectionType;
  title: string;
  subtitle: string | null;
  content: string | null;
  buttonLabel: string | null;
  buttonUrl: string | null;
  order: number;
  isActive: boolean;
};

export type LandingImage = {
  id: string;
  sectionId: string | null;
  url: string;
  alt: string;
  type: LandingImageType;
  order: number;
};

export type WhatsAppConfig = {
  phone: string;
  defaultMessage: string;
  buttonLabel: string;
  isEnabled: boolean;
};

export type SeoConfig = {
  metaTitle: string;
  metaDescription: string;
  ogTitle: string | null;
  ogDescription: string | null;
  ogImage: string | null;
  canonicalUrl: string | null;
};

export type PublicLandingResponse = {
  landing: {
    id: string;
    name: string;
    slug: string;
    businessName: string;
    description: string;
  };
  theme: LandingTheme | null;
  sections: LandingSection[];
  images: LandingImage[];
  whatsapp: WhatsAppConfig | null;
  seo: SeoConfig | null;
};
