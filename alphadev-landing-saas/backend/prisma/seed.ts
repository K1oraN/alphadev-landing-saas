import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import type { LandingImageType, LandingSectionType } from "@prisma/client";

const prisma = new PrismaClient();

const adminEmail = "admin@admin.com";

const defaultLanding = {
  name: "Landing Principal",
  slug: "principal",
  businessName: "Nova Essencia",
  description:
    "Solucoes modernas e personalizadas para apresentar sua empresa com clareza, fortalecer sua presenca digital e facilitar o contato com novos clientes.",
  status: "PUBLISHED" as const,
  plan: "PRO" as const,
};

const defaultTheme = {
  primaryColor: "#2563eb",
  secondaryColor: "#4f46e5",
  backgroundColor: "#f8fafc",
  textColor: "#0f172a",
  buttonColor: "#2563eb",
  buttonTextColor: "#ffffff",
  fontFamily: "Inter, system-ui, sans-serif",
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
    title: "Solucoes modernas para transformar sua presenca digital",
    subtitle: "Nova Essencia",
    content:
      "Apresente sua empresa com clareza, destaque seus diferenciais e receba contatos qualificados em uma pagina rapida, bonita e totalmente personalizavel.",
    buttonLabel: "Solicitar atendimento",
    buttonUrl: "#contato",
    order: 1,
  },
  {
    type: "ABOUT",
    title: "Uma apresentacao profissional para sua empresa",
    subtitle: "Clareza, confianca e conversao em uma unica experiencia",
    content:
      "Organize suas informacoes, servicos, imagens e canais de contato em uma experiencia clara, moderna e pensada para converter visitantes em clientes.",
    order: 2,
  },
  {
    type: "BENEFITS",
    title: "Tudo que sua landing precisa para vender melhor",
    subtitle: "Recursos essenciais para uma presenca digital mais forte",
    content:
      "Design responsivo; carregamento rapido; conteudo editavel; formulario de leads; botao de WhatsApp; SEO basico; galeria de imagens; painel administrativo.",
    order: 3,
  },
  {
    type: "CUSTOM",
    title: "Solucoes pensadas para o seu negocio",
    subtitle: "Servicos que deixam sua pagina mais completa",
    content:
      "Estrategia personalizada|Pagina otimizada|Captacao de contatos|Integracao com WhatsApp|Gestao simples|Visual adaptavel",
    order: 4,
  },
  {
    type: "GALLERY",
    title: "Galeria",
    subtitle: "Mostre produtos, equipe, ambientes ou resultados",
    content: "Adicione imagens no painel para deixar sua landing mais visual, humana e confiavel.",
    order: 5,
  },
  {
    type: "TESTIMONIALS",
    title: "Depoimentos",
    subtitle: "Clientes que perceberam valor rapidamente",
    content:
      "Mariana Costa, Gestora Comercial: A pagina ficou clara, bonita e facilitou muito o contato dos clientes com nossa equipe.|Rafael Mendes, Empreendedor: Conseguimos apresentar nossos servicos de forma mais profissional e recebemos contatos mais qualificados.|Camila Rocha, Consultora: O painel tornou simples atualizar textos, imagens e informacoes sem depender de alteracoes no codigo.",
    order: 6,
  },
  {
    type: "CTA",
    title: "Pronto para personalizar sua pagina?",
    subtitle: "Atualize textos, cores, imagens e canais de contato diretamente pelo painel administrativo.",
    content: "Preencha o formulario ou chame pelo WhatsApp para iniciar uma conversa.",
    buttonLabel: "Entrar em contato",
    buttonUrl: "#contato",
    order: 7,
  },
  {
    type: "FOOTER",
    title: "Nova Essencia",
    content: "Solucoes modernas e personalizadas para apresentar sua empresa com clareza.",
    order: 8,
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
    url: "https://placehold.co/240x80/ffffff/2563eb?text=Nova+Essencia",
    alt: "Logo Nova Essencia",
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

  const existingOwner = await prisma.user.findFirst({
    where: { role: "OWNER" },
    orderBy: { createdAt: "asc" },
  });

  if (existingOwner) {
    return prisma.user.update({
      where: { id: existingOwner.id },
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

  const mainLanding = await prisma.landingPage.findFirst({
    where: { isMain: true },
    orderBy: { createdAt: "asc" },
  });

  if (mainLanding) {
    return prisma.landingPage.update({
      where: { id: mainLanding.id },
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
        "Ola! Vim pela landing da Nova Essencia e gostaria de receber atendimento.",
      buttonLabel: "Chamar no WhatsApp",
      isEnabled: true,
    },
    create: {
      landingPageId: landingPage.id,
      phone: "5511999999999",
      defaultMessage:
        "Ola! Vim pela landing da Nova Essencia e gostaria de receber atendimento.",
      buttonLabel: "Chamar no WhatsApp",
      isEnabled: true,
    },
  });

  await prisma.seoConfig.upsert({
    where: {
      landingPageId: landingPage.id,
    },
    update: {
      metaTitle: "Nova Essencia | Solucoes Personalizadas",
      metaDescription:
        "Conheca solucoes modernas para apresentar sua empresa com clareza e receber contatos qualificados.",
      ogTitle: "Nova Essencia",
      ogDescription:
        "Uma pagina moderna para apresentar servicos, diferenciais e canais de contato.",
      ogImage:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80",
      canonicalUrl: null,
    },
    create: {
      landingPageId: landingPage.id,
      metaTitle: "Nova Essencia | Solucoes Personalizadas",
      metaDescription:
        "Conheca solucoes modernas para apresentar sua empresa com clareza e receber contatos qualificados.",
      ogTitle: "Nova Essencia",
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
        name: "Mariana Costa",
        email: "mariana@email.com",
        phone: "11988887777",
        message: "Gostaria de saber mais sobre as solucoes.",
        source: "seed-example",
        utmSource: "organico",
        utmMedium: "site",
        utmCampaign: "landing-principal",
      },
      {
        landingPageId: landingPage.id,
        name: "Rafael Mendes",
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
