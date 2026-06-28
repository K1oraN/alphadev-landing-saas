import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const owner = await prisma.user.upsert({
    where: { email: "admin@alphadev.com.br" },
    update: {
      name: "Admin AlphaDev",
      role: "OWNER",
      status: "ACTIVE",
    },
    create: {
      name: "Admin AlphaDev",
      email: "admin@alphadev.com.br",
      passwordHash: "demo-password-hash",
      role: "OWNER",
      status: "ACTIVE",
    },
  });

  await prisma.landingPage.deleteMany({
    where: { slug: "barbearia-demo" },
  });

  const landingPage = await prisma.landingPage.create({
    data: {
      ownerId: owner.id,
      name: "Landing Barbearia Demo",
      slug: "barbearia-demo",
      businessName: "Barbearia Demo AlphaDev",
      description:
        "Barbearia premium com atendimento agendado, cortes modernos, barba alinhada e experiencia completa para clientes exigentes.",
      status: "PUBLISHED",
      plan: "PRO",
    },
  });

  await prisma.landingTheme.create({
    data: {
      landingPageId: landingPage.id,
      primaryColor: "#ef1d2f",
      secondaryColor: "#111116",
      backgroundColor: "#07070a",
      textColor: "#f8fafc",
      buttonColor: "#ef1d2f",
      buttonTextColor: "#ffffff",
      fontFamily: "Inter",
    },
  });

  const heroSection = await prisma.landingSection.create({
    data: {
      landingPageId: landingPage.id,
      type: "HERO",
      title: "Corte, barba e estilo no mesmo lugar",
      subtitle: "Barbearia Demo AlphaDev",
      content:
        "Atendimento profissional, ambiente moderno e agendamento simples para voce cuidar do visual sem perder tempo.",
      buttonLabel: "Agendar pelo WhatsApp",
      buttonUrl: "https://wa.me/5511999999999",
      order: 1,
    },
  });

  await prisma.landingSection.createMany({
    data: [
      {
        landingPageId: landingPage.id,
        type: "ABOUT",
        title: "Sobre a barbearia",
        subtitle: "Experiencia completa para o publico masculino",
        content:
          "Unimos tecnica, pontualidade e atendimento de alto padrao para entregar cortes, barba e acabamento com consistencia.",
        order: 2,
      },
      {
        landingPageId: landingPage.id,
        type: "BENEFITS",
        title: "Beneficios",
        subtitle: "Por que escolher a Barbearia Demo AlphaDev",
        content:
          "Agendamento rapido; profissionais experientes; ambiente confortavel; atendimento personalizado.",
        order: 3,
      },
      {
        landingPageId: landingPage.id,
        type: "TESTIMONIALS",
        title: "Depoimentos",
        subtitle: "Clientes que recomendam",
        content:
          "Atendimento impecavel e corte muito bem feito.|Melhor experiencia de barbearia da regiao.",
        order: 4,
      },
      {
        landingPageId: landingPage.id,
        type: "CTA",
        title: "Pronto para renovar seu estilo?",
        subtitle: "Fale agora com a equipe",
        content:
          "Clique no botao e agende seu horario pelo WhatsApp em poucos minutos.",
        buttonLabel: "Chamar no WhatsApp",
        buttonUrl: "https://wa.me/5511999999999",
        order: 5,
      },
      {
        landingPageId: landingPage.id,
        type: "FOOTER",
        title: "Barbearia Demo AlphaDev",
        content: "Rua Demo, 123 - Centro. Atendimento de segunda a sabado.",
        order: 6,
      },
    ],
  });

  await prisma.landingImage.createMany({
    data: [
      {
        landingPageId: landingPage.id,
        sectionId: heroSection.id,
        url: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
        alt: "Barbeiro fazendo acabamento em cliente",
        type: "HERO",
        order: 1,
      },
      {
        landingPageId: landingPage.id,
        url: "https://placehold.co/240x80/07070a/ef1d2f?text=AlphaDev+Barber",
        alt: "Logo Barbearia Demo AlphaDev",
        type: "LOGO",
        order: 1,
      },
    ],
  });

  await prisma.whatsAppConfig.create({
    data: {
      landingPageId: landingPage.id,
      phone: "5511999999999",
      defaultMessage:
        "Ola! Vim pela landing da Barbearia Demo AlphaDev e quero agendar um horario.",
      buttonLabel: "Agendar pelo WhatsApp",
      isEnabled: true,
    },
  });

  await prisma.seoConfig.create({
    data: {
      landingPageId: landingPage.id,
      metaTitle: "Barbearia Demo AlphaDev | Corte e barba com agendamento",
      metaDescription:
        "Landing demo de barbearia criada para o AlphaDev Landing SaaS.",
      ogTitle: "Barbearia Demo AlphaDev",
      ogDescription:
        "Cortes modernos, barba alinhada e atendimento profissional.",
      ogImage:
        "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1200&q=80",
      canonicalUrl: "https://barbearia-demo.alphadev.com.br",
    },
  });

  await prisma.subscription.create({
    data: {
      landingPageId: landingPage.id,
      status: "ACTIVE",
      startedAt: new Date(),
      dueDay: 10,
      nextPaymentAt: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    },
  });

  await prisma.lead.createMany({
    data: [
      {
        landingPageId: landingPage.id,
        name: "Lucas Pereira",
        email: "lucas.demo@email.com",
        phone: "11988887777",
        message: "Quero agendar corte e barba para sexta.",
        source: "landing-demo",
        utmSource: "instagram",
        utmMedium: "social",
        utmCampaign: "barbearia-demo",
      },
      {
        landingPageId: landingPage.id,
        name: "Bruno Martins",
        phone: "11977776666",
        message: "Gostaria de saber os horarios disponiveis.",
        source: "landing-demo",
      },
      {
        landingPageId: landingPage.id,
        name: "Henrique Souza",
        email: "henrique.demo@email.com",
        phone: "11966665555",
        source: "landing-demo",
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("Seed demo criado com sucesso.");
  })
  .catch(async (error) => {
    console.error("Erro ao executar seed:", error);
    await prisma.$disconnect();
    process.exit(1);
  });
