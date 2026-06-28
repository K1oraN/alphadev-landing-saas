import { prisma } from "../lib/prisma.js";

export async function getPublicLandingBySlug(slug: string) {
  const landing = await prisma.landingPage.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
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
          order: "asc",
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
        orderBy: {
          order: "asc",
        },
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
    },
  });

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
