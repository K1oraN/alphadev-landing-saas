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

  await prisma.lead.create({
    data: {
      landingPageId: landing.id,
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
