export type LandingContent = {
  title: string;
  description: string;
  primaryColor: string;
  whatsappUrl: string;
};

export type LandingSectionType =
  | "HERO"
  | "ABOUT"
  | "BENEFITS"
  | "TESTIMONIALS"
  | "GALLERY"
  | "CTA"
  | "FOOTER"
  | "CUSTOM";

export type DemoLandingSection = {
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

export type DemoLandingImage = {
  id: string;
  url: string;
  alt: string;
  type: "LOGO" | "HERO" | "GALLERY" | "TESTIMONIAL" | "OTHER";
  order: number;
};

export type DemoLandingResponse = {
  id: string;
  name: string;
  slug: string;
  businessName: string;
  description: string;
  status: string;
  plan: string;
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
    fontFamily: string;
  } | null;
  sections: DemoLandingSection[];
  images: DemoLandingImage[];
  whatsappConfig: {
    phone: string;
    defaultMessage: string;
    buttonLabel: string;
    isEnabled: boolean;
  } | null;
  seoConfig: {
    metaTitle: string;
    metaDescription: string;
    ogTitle: string | null;
    ogDescription: string | null;
    ogImage: string | null;
    canonicalUrl: string | null;
  } | null;
  leadsCount: number;
};
