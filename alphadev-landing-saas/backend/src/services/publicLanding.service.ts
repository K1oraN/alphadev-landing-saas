import type { Prisma } from "@prisma/client";
import { prisma } from "../lib/prisma.js";

const publicLandingSelect = {
  id: true,
  name: true,
  slug: true,
  businessName: true,
  description: true,
  theme: {
    select: {
      primaryColor: true,
      secondaryColor: true,
      backgroundColor: true,
      textColor: true,
      buttonColor: true,
      buttonTextColor: true,
      fontFamily: true,
    },
  },
  sections: {
    where: {
      isActive: true,
    },
    orderBy: {
      order: "asc" as const,
    },
    select: {
      id: true,
      type: true,
      title: true,
      subtitle: true,
      content: true,
      buttonLabel: true,
      buttonUrl: true,
      order: true,
      isActive: true,
    },
  },
  images: {
    orderBy: [{ type: "asc" as const }, { order: "asc" as const }],
    select: {
      id: true,
      sectionId: true,
      url: true,
      alt: true,
      type: true,
      order: true,
    },
  },
  whatsappConfig: {
    select: {
      phone: true,
      defaultMessage: true,
      buttonLabel: true,
      isEnabled: true,
    },
  },
  seoConfig: {
    select: {
      metaTitle: true,
      metaDescription: true,
      ogTitle: true,
      ogDescription: true,
      ogImage: true,
      canonicalUrl: true,
    },
  },
} satisfies Prisma.LandingPageSelect;

type PublicLandingPayload = Prisma.LandingPageGetPayload<{
  select: typeof publicLandingSelect;
}>;

function toPublicLandingResponse(landing: PublicLandingPayload | null) {
  if (!landing) {
    return null;
  }

  return {
    landing: {
      id: landing.id,
      name: landing.name,
      slug: landing.slug,
      businessName: landing.businessName,
      description: landing.description,
    },
    theme: landing.theme,
    sections: landing.sections,
    images: landing.images,
    whatsapp: landing.whatsappConfig,
    seo: landing.seoConfig,
  };
}

async function findMainPublicLanding() {
  const mainLanding = await prisma.landingPage.findFirst({
    where: {
      isMain: true,
      status: "PUBLISHED",
    },
    select: publicLandingSelect,
  });

  if (mainLanding) {
    return mainLanding;
  }

  return prisma.landingPage.findFirst({
    where: {
      status: "PUBLISHED",
    },
    orderBy: {
      createdAt: "asc",
    },
    select: publicLandingSelect,
  });
}

async function findPublicLandingBySlug(slug: string) {
  return prisma.landingPage.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: publicLandingSelect,
  });
}

export async function getMainPublicLanding() {
  const landing = await findMainPublicLanding();

  return toPublicLandingResponse(landing);
}

export async function getPublicLandingBySlug(slug: string) {
  const landing = await findPublicLandingBySlug(slug);

  return toPublicLandingResponse(landing);
}
