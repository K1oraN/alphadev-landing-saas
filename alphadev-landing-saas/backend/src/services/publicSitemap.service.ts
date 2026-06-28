import { env } from "../config/env.js";
import { prisma } from "../lib/prisma.js";

export async function getPublicSitemap() {
  const landings = await prisma.landingPage.findMany({
    where: {
      status: "PUBLISHED",
    },
    select: {
      slug: true,
      updatedAt: true,
      seoConfig: {
        select: {
          canonicalUrl: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return landings.map((landing) => ({
    slug: landing.slug,
    updatedAt: landing.updatedAt,
    canonicalUrl:
      landing.seoConfig?.canonicalUrl ?? `${env.FRONTEND_URL}/site/${landing.slug}`,
  }));
}
