import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import type { LandingImageType, LandingSectionType } from "@prisma/client";

const prisma = new PrismaClient();

const adminEmail = "admin@suaempresa.com";
const legacyAdminEmail = "admin@demo.com";

const defaultLanding = {
  name: "Landing Principal",
  slug: "principal",
  businessName: "Sua Empresa",
  description:
    "Uma landing page moderna, rapida e personalizavel para apresentar sua empresa, seus servicos e captar novos contatos.",
  status: "PUBLISHED" as const,
  plan: "PRO" as const,
};

const defaultTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#f8fafc",
  backgroundColor: "#ffffff",
  textColor: "#0f172a",
  buttonColor: "#2563eb",
  buttonTextColor: "#ffffff",
  fontFamily: "Inter",
};

const defaultSections: Array<{
  type: LandingSectionType;
  title: string;
  subtitle?: string;
  content?: string;
  buttonLabel?: string;
  buttonUrl?: string;
  order: number;
  isActive?: boolean;
}> = [
  {
    type: "HERO",
    title: "Transforme visitantes em clientes",
    subtitle: "Sua Empresa",
    content:
      "Uma pagina moderna, clara e objetiva para apresentar sua empresa, destacar seus diferenciais e receber contatos qualificados.",
    buttonLabel: "Fale conosco",
    buttonUrl: "#contato",
    order: 1,
  },
  {
    type: "ABOUT",
    title: "Sobre a empresa",
    subtitle: "Apresente sua historia com clareza",
    content:
      "Use este espaco para contar quem voce e, o que sua empresa faz e por que seus clientes devem confiar no seu trabalho.",
    order: 2,
  },
  {
    type: "BENEFITS",
    title: "Por que escolher nossa solucao?",
    subtitle: "Diferenciais que ajudam sua empresa a vender melhor",
    content:
      "Atendimento personalizado; apresentacao profissional; facil contato; experiencia otimizada em qualquer dispositivo.",
    order: 3,
  },
  {
    type: "GALLERY",
    title: "Galeria",
    subtitle: "Mostre produtos, equipe, espacos ou resultados",
    content: "Adicione imagens no painel para deixar sua landing mais visual e confiavel.",
    order: 4,
  },
  {
    type: "TESTIMONIALS",
    title: "Depoimentos",
    subtitle: "Confiança construida com bons resultados",
    content:
      "Atendimento claro, rapido e muito profissional.|A pagina facilitou o contato e deixou a apresentacao mais completa.|Experiencia simples, bonita e objetiva em qualquer dispositivo.",
    order: 5,
  },
  {
    type: "CTA",
    title: "Pronto para comecar?",
    subtitle: "Entre em contato e descubra como podemos ajudar.",
    content:
      "Preencha o formulario ou chame pelo WhatsApp. Sua equipe pode personalizar este texto pelo painel.",
    buttonLabel: "Solicitar atendimento",
    buttonUrl: "#contato",
    order: 6,
  },
  {
    type: "FOOTER",
    title: "Sua Empresa",
    content: "Uma landing moderna, clara e pronta para ser personalizada.",
    order: 7,
  },
];

const defaultImages: Array<{
  type: LandingImageType;
  sectionType?: LandingSectionType;
  url: string;
  alt: string;
  order: number;
}> = [
  {
    type: "HERO",
    sectionType: "HERO",
    url: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    alt: "Equipe trabalhando em um escritorio moderno e claro",
    order: 1,
  },
  {
    type: "OTHER",
    sectionType: "ABOUT",
    url: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1000&q=80",
    alt: "Reuniao profissional com pessoas colaborando",
    order: 2,
  },
  {
    type: "GALLERY",
    sectionType: "GALLERY",
    url: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=900&q=80",
    alt: "Equipe analisando um projeto em notebooks",
    order: 1,
  },
  {
    type: "GALLERY",
    sectionType: "GALLERY",
    url: "https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=900&q=80",
    alt: "Atendimento profissional em ambiente corporativo",
    order: 2,
  },
  {
    type: "GALLERY",
    sectionType: "GALLERY",
    url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=900&q=80",
    alt: "Pessoas planejando ideias em uma mesa de trabalho",
    order: 3,
  },
  {
    type: "LOGO",
    url: "https://placehold.co/240x80/ffffff/2563eb?text=Sua+Empresa",
    alt: "Logo Sua Empresa",
    order: 1,
  },
];

async function getOrCreateOwner(passwordHash: string) {
  const owner = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (owner) {
    return prisma.user.update({
      where: { id: owner.id },
      data: {
        name: "Administrador",
        passwordHash,
        role: "OWNER",
        status: "ACTIVE",
      },
    });
  }

  const legacyOwner = await prisma.user.findUnique({
    where: { email: legacyAdminEmail },
  });

  if (legacyOwner) {
    return prisma.user.update({
      where: { id: legacyOwner.id },
      data: {
        name: "Administrador",
        email: adminEmail,
        passwordHash,
        role: "OWNER",
        status: "ACTIVE",
      },
    });
  }

  return prisma.user.create({
    data: {
      name: "Administrador",
      email: adminEmail,
      passwordHash,
      role: "OWNER",
      status: "ACTIVE",
    },
  });
}

async function getOrCreateLanding(ownerId: string) {
  const landing = await prisma.landingPage.findUnique({
    where: { slug: defaultLanding.slug },
  });

  if (landing) {
    return prisma.landingPage.update({
      where: { id: landing.id },
      data: {
        ownerId,
        ...defaultLanding,
      },
    });
  }

  const legacyLanding = await prisma.landingPage.findUnique({
    where: { slug: "barbearia-demo" },
  });

  if (legacyLanding) {
    return prisma.landingPage.update({
      where: { id: legacyLanding.id },
      data: {
        ownerId,
        ...defaultLanding,
      },
    });
  }

  return prisma.landingPage.create({
    data: {
      ownerId,
      ...defaultLanding,
    },
  });
}

async function upsertSections(landingPageId: string) {
  const sectionsByType = new Map(
    (
      await prisma.landingSection.findMany({
        where: { landingPageId },
      })
    ).map((section) => [section.type, section]),
  );

  const sections = new Map<LandingSectionType, { id: string }>();

  for (const section of defaultSections) {
    const existing = sectionsByType.get(section.type);

    if (existing) {
      const updatedSection = await prisma.landingSection.update({
        where: { id: existing.id },
        data: {
          ...section,
          isActive: section.isActive ?? true,
        },
      });
      sections.set(section.type, updatedSection);
      continue;
    }

    const createdSection = await prisma.landingSection.create({
      data: {
        landingPageId,
        ...section,
        isActive: section.isActive ?? true,
      },
    });
    sections.set(section.type, createdSection);
  }

  return sections;
}

async function upsertImages(
  landingPageId: string,
  sections: Map<LandingSectionType, { id: string }>,
) {
  await prisma.landingImage.deleteMany({
    where: { landingPageId },
  });

  await prisma.landingImage.createMany({
    data: defaultImages.map((image) => ({
      landingPageId,
      sectionId: image.sectionType ? sections.get(image.sectionType)?.id : undefined,
      url: image.url,
      alt: image.alt,
      type: image.type,
      order: image.order,
    })),
  });
}

async function main() {
  const passwordHash = await bcrypt.hash("123456", 10);
  const owner = await getOrCreateOwner(passwordHash);
  const landingPage = await getOrCreateLanding(owner.id);

  await prisma.landingPage.updateMany({
    where: {
      id: {
        not: landingPage.id,
      },
      isMain: true,
    },
    data: {
      isMain: false,
    },
  });

  await prisma.landingPage.update({
    where: {
      id: landingPage.id,
    },
    data: {
      isMain: true,
    },
  });

  await prisma.landingTheme.upsert({
    where: {
      landingPageId: landingPage.id,
    },
    update: defaultTheme,
    create: {
      landingPageId: landingPage.id,
      ...defaultTheme,
    },
  });

  const sections = await upsertSections(landingPage.id);
  await upsertImages(landingPage.id, sections);

  await prisma.whatsAppConfig.upsert({
    where: {
      landingPageId: landingPage.id,
    },
    update: {
      phone: "5511999999999",
      defaultMessage:
        "Ola! Vim pela landing da Sua Empresa e gostaria de receber atendimento.",
      buttonLabel: "Chamar no WhatsApp",
      isEnabled: true,
    },
    create: {
      landingPageId: landingPage.id,
      phone: "5511999999999",
      defaultMessage:
        "Ola! Vim pela landing da Sua Empresa e gostaria de receber atendimento.",
      buttonLabel: "Chamar no WhatsApp",
      isEnabled: true,
    },
  });

  await prisma.seoConfig.upsert({
    where: {
      landingPageId: landingPage.id,
    },
    update: {
      metaTitle: "Sua Empresa | Landing Page",
      metaDescription:
        "Conheca nossa empresa, nossos servicos e fale conosco de forma rapida e simples.",
      ogTitle: "Sua Empresa",
      ogDescription:
        "Uma pagina moderna para apresentar servicos, diferenciais e canais de contato.",
      ogImage:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      canonicalUrl: null,
    },
    create: {
      landingPageId: landingPage.id,
      metaTitle: "Sua Empresa | Landing Page",
      metaDescription:
        "Conheca nossa empresa, nossos servicos e fale conosco de forma rapida e simples.",
      ogTitle: "Sua Empresa",
      ogDescription:
        "Uma pagina moderna para apresentar servicos, diferenciais e canais de contato.",
      ogImage:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
    },
  });

  await prisma.subscription.upsert({
    where: {
      landingPageId: landingPage.id,
    },
    update: {
      status: "ACTIVE",
      dueDay: 10,
      nextPaymentAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
    create: {
      landingPageId: landingPage.id,
      status: "ACTIVE",
      startedAt: new Date(),
      dueDay: 10,
      nextPaymentAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  await prisma.lead.deleteMany({
    where: {
      landingPageId: landingPage.id,
      source: "seed-example",
    },
  });

  await prisma.lead.createMany({
    data: [
      {
        landingPageId: landingPage.id,
        name: "Cliente Exemplo",
        email: "cliente@email.com",
        phone: "11988887777",
        message: "Gostaria de saber mais sobre os servicos.",
        source: "seed-example",
        utmSource: "organico",
        utmMedium: "site",
        utmCampaign: "landing-principal",
      },
      {
        landingPageId: landingPage.id,
        name: "Contato Comercial",
        phone: "11977776666",
        message: "Quero receber atendimento pelo WhatsApp.",
        source: "seed-example",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed principal atualizado com sucesso.");
  })
  .catch(async (error) => {
    console.error("Erro ao executar seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
