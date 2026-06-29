import { HttpError } from "../lib/httpError.js";
import { prisma } from "../lib/prisma.js";

export type PublicLeadData = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
};

async function createLeadForLanding(landingPageId: string, data: PublicLeadData) {
  await prisma.lead.create({
    data: {
      landingPageId,
      name: data.name,
      phone: data.phone,
      email: data.email,
      message: data.message,
      source: data.source,
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
    },
  });

  return {
    message: "Mensagem enviada com sucesso.",
  };
}

async function findMainPublishedLandingId() {
  const mainLanding = await prisma.landingPage.findFirst({
    where: {
      isMain: true,
      status: "PUBLISHED",
    },
    select: {
      id: true,
    },
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
    select: {
      id: true,
    },
  });
}

export async function createLeadForMainLanding(data: PublicLeadData) {
  const landing = await findMainPublishedLandingId();

  if (!landing) {
    throw new HttpError(404, "Landing principal publica nao encontrada ou indisponivel.");
  }

  return createLeadForLanding(landing.id, data);
}

export async function createLeadByLandingSlug(slug: string, data: PublicLeadData) {
  const landing = await prisma.landingPage.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
    },
    select: {
      id: true,
    },
  });

  if (!landing) {
    throw new HttpError(404, "Landing publica nao encontrada ou indisponivel.");
  }

  return createLeadForLanding(landing.id, data);
}
