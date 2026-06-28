import type { LandingImage, LandingSection, LandingTheme, WhatsAppConfig } from "../../types/landing";
import { AboutSection } from "./sections/AboutSection";
import { BenefitsSection } from "./sections/BenefitsSection";
import { CtaSection } from "./sections/CtaSection";
import { CustomSection } from "./sections/CustomSection";
import { FooterSection } from "./sections/FooterSection";
import { GallerySection } from "./sections/GallerySection";
import { HeroSection } from "./sections/HeroSection";
import { TestimonialsSection } from "./sections/TestimonialsSection";

type LandingSectionRendererProps = {
  section: LandingSection;
  images: LandingImage[];
  theme: LandingTheme;
  whatsapp: WhatsAppConfig | null;
};

export function LandingSectionRenderer(props: LandingSectionRendererProps) {
  switch (props.section.type) {
    case "HERO":
      return <HeroSection {...props} />;
    case "ABOUT":
      return <AboutSection {...props} />;
    case "BENEFITS":
      return <BenefitsSection {...props} />;
    case "TESTIMONIALS":
      return <TestimonialsSection {...props} />;
    case "GALLERY":
      return <GallerySection {...props} />;
    case "CTA":
      return <CtaSection {...props} />;
    case "FOOTER":
      return <FooterSection {...props} />;
    case "CUSTOM":
    default:
      return <CustomSection {...props} />;
  }
}
