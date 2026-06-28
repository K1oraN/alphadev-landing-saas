export type LandingImageType = "LOGO" | "HERO" | "GALLERY" | "TESTIMONIAL" | "OTHER";

export type LandingImage = {
  id: string;
  landingPageId: string;
  sectionId: string | null;
  url: string;
  alt: string;
  type: LandingImageType;
  order: number;
  createdAt: string;
  updatedAt: string;
};

export type UploadImagePayload = {
  image: File;
  type: LandingImageType;
  alt?: string;
  sectionId?: string;
  order?: number;
};

export type UpdateImagePayload = {
  type: LandingImageType;
  alt?: string;
  sectionId?: string;
  order?: number;
};
