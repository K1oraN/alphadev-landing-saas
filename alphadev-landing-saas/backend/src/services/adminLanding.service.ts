import type { LandingSectionType, LandingStatus } from "@prisma/client";
import { HttpError } from "../lib/httpError.js";
import { prisma } from "../lib/prisma.js";

const defaultTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#f8fafc",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  buttonColor: "#2563eb",
  buttonTextColor: "#ffffff",
  fontFamily: "Inter",
};

export type UpdateLandingMainData = {
  name: string;
  slug: string;
  businessName: string;
  description: string;
  status: LandingStatus;
};

export type UpdateThemeData = Partial<typeof defaultTheme>;

export type UpdateWhatsappData = {
  phone: string;
  defaultMessage: string;
  buttonLabel: string;
  isEnabled: boolean;
};

export type UpdateSeoData = {
  metaTitle: string;
  metaDescription: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
};

export type SectionPayload = {
  type: LandingSectionType;
  title: string;
  subtitle?: string;
  content?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  order: number;
  isActive: boolean;
};

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

async function getOwnedLandingOrThrow(ownerId: string) {
  const landing = await prisma.landingPage.findFirst({
    where: {
      ownerId,
    },
    orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
  });

  if (!landing) {
    throw new HttpError(404, "Nenhuma landing encontrada para este usuario.");
  }

  return landing;
}

export async function getMyLanding(ownerId: string) {
  const landing = await prisma.landingPage.findFirst({
    where: {
      ownerId,
    },
    orderBy: [{ isMain: "desc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      slug: true,
      businessName: true,
      description: true,
      status: true,
      plan: true,
      isMain: true,
      createdAt: true,
      updatedAt: true,
      theme: true,
      sections: {
        orderBy: {
          order: "asc",
        },
      },
      whatsappConfig: true,
      seoConfig: true,
      subscription: true,
    },
  });

  if (!landing) {
    throw new HttpError(404, "Nenhuma landing encontrada para este usuario.");
  }

  return landing;
}

export async function updateLandingMain(ownerId: string, data: UpdateLandingMainData) {
  const landing = await getOwnedLandingOrThrow(ownerId);
  const slug = normalizeSlug(data.slug);

  if (!slug || slug.length < 3) {
    throw new HttpError(400, "Slug invalido. Use letras, numeros e hifens.");
  }

  const slugOwner = await prisma.landingPage.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (slugOwner && slugOwner.id !== landing.id) {
    throw new HttpError(
      400,
      "Este slug ja esta em uso. Escolha outro endereco para sua landing.",
    );
  }

  return prisma.$transaction(async (tx) => {
    await tx.landingPage.updateMany({
      where: {
        id: {
          not: landing.id,
        },
        isMain: true,
      },
      data: {
        isMain: false,
      },
    });

    return tx.landingPage.update({
      where: {
        id: landing.id,
      },
      data: {
        name: data.name,
        slug,
        businessName: data.businessName,
        description: data.description,
        status: data.status,
        isMain: true,
      },
    });
  });
}

export async function upsertTheme(ownerId: string, data: UpdateThemeData) {
  const landing = await getOwnedLandingOrThrow(ownerId);
  const themeData = {
    ...defaultTheme,
    ...data,
  };

  return prisma.landingTheme.upsert({
    where: {
      landingPageId: landing.id,
    },
    update: themeData,
    create: {
      landingPageId: landing.id,
      ...themeData,
    },
  });
}

export async function upsertWhatsapp(ownerId: string, data: UpdateWhatsappData) {
  const landing = await getOwnedLandingOrThrow(ownerId);

  return prisma.whatsAppConfig.upsert({
    where: {
      landingPageId: landing.id,
    },
    update: data,
    create: {
      landingPageId: landing.id,
      ...data,
    },
  });
}

export async function upsertSeo(ownerId: string, data: UpdateSeoData) {
  const landing = await getOwnedLandingOrThrow(ownerId);

  return prisma.seoConfig.upsert({
    where: {
      landingPageId: landing.id,
    },
    update: data,
    create: {
      landingPageId: landing.id,
      ...data,
    },
  });
}

export async function getSections(ownerId: string) {
  const landing = await getOwnedLandingOrThrow(ownerId);

  return prisma.landingSection.findMany({
    where: {
      landingPageId: landing.id,
    },
    orderBy: {
      order: "asc",
    },
  });
}

export async function createSection(ownerId: string, data: SectionPayload) {
  const landing = await getOwnedLandingOrThrow(ownerId);

  return prisma.landingSection.create({
    data: {
      landingPageId: landing.id,
      ...data,
    },
  });
}

async function getOwnedSectionOrThrow(ownerId: string, sectionId: string) {
  const section = await prisma.landingSection.findFirst({
    where: {
      id: sectionId,
      landingPage: {
        ownerId,
      },
    },
  });

  if (!section) {
    throw new HttpError(404, "Secao nao encontrada para esta landing.");
  }

  return section;
}

export async function updateSection(ownerId: string, sectionId: string, data: SectionPayload) {
  await getOwnedSectionOrThrow(ownerId, sectionId);

  return prisma.landingSection.update({
    where: {
      id: sectionId,
    },
    data,
  });
}

export async function deleteSection(ownerId: string, sectionId: string) {
  await getOwnedSectionOrThrow(ownerId, sectionId);

  await prisma.landingSection.delete({
    where: {
      id: sectionId,
    },
  });
}

export async function toggleSection(ownerId: string, sectionId: string) {
  const section = await getOwnedSectionOrThrow(ownerId, sectionId);

  return prisma.landingSection.update({
    where: {
      id: sectionId,
    },
    data: {
      isActive: !section.isActive,
    },
  });
}
