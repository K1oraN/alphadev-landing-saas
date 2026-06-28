import { prisma } from "../lib/prisma.js";

export async function getDemoLanding() {
  return prisma.landingPage.findUnique({
    where: {
      slug: "barbearia-demo",
    },
    include: {
      theme: true,
      sections: {
        orderBy: {
          order: "asc",
        },
      },
      images: {
        orderBy: {
          order: "asc",
        },
      },
      whatsappConfig: true,
      seoConfig: true,
      _count: {
        select: {
          leads: true,
        },
      },
    },
  });
}
