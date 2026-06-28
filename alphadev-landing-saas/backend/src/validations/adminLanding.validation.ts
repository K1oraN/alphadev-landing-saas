import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const hexColorSchema = z
  .preprocess(emptyToUndefined, z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional());

export const landingStatusSchema = z.enum(["DRAFT", "PUBLISHED", "SUSPENDED", "BLOCKED"]);

export const landingSectionTypeSchema = z.enum([
  "HERO",
  "ABOUT",
  "BENEFITS",
  "TESTIMONIALS",
  "GALLERY",
  "CTA",
  "FOOTER",
  "CUSTOM",
]);

export const updateLandingMainSchema = z.object({
  name: z.string().min(2, "Nome da landing e obrigatorio.").max(120),
  slug: z.string().min(3, "Slug deve ter pelo menos 3 caracteres.").max(80),
  businessName: z.string().min(2, "Nome da empresa e obrigatorio.").max(160),
  description: z.string().min(10, "Descricao deve ter pelo menos 10 caracteres.").max(800),
  status: landingStatusSchema,
});

export const updateThemeSchema = z.object({
  primaryColor: hexColorSchema,
  secondaryColor: hexColorSchema,
  backgroundColor: hexColorSchema,
  textColor: hexColorSchema,
  buttonColor: hexColorSchema,
  buttonTextColor: hexColorSchema,
  fontFamily: z.preprocess(emptyToUndefined, z.string().min(2).max(80).optional()),
});

export const updateWhatsappSchema = z.object({
  phone: z
    .string()
    .min(8, "Telefone deve ter pelo menos 8 digitos.")
    .regex(/^[0-9+()\-\s]+$/, "Telefone contem caracteres invalidos."),
  defaultMessage: z.string().min(3, "Mensagem padrao e obrigatoria.").max(400),
  buttonLabel: z.string().min(2, "Texto do botao e obrigatorio.").max(80),
  isEnabled: z.boolean(),
});

export const updateSeoSchema = z.object({
  metaTitle: z.string().min(3, "Meta title e obrigatorio.").max(70),
  metaDescription: z.string().min(10, "Meta description e obrigatoria.").max(180),
  ogTitle: z.preprocess(emptyToUndefined, z.string().max(90).optional()),
  ogDescription: z.preprocess(emptyToUndefined, z.string().max(220).optional()),
  ogImage: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
  canonicalUrl: z.preprocess(emptyToUndefined, z.string().url().max(500).optional()),
});

export const sectionPayloadSchema = z.object({
  type: landingSectionTypeSchema,
  title: z.string().min(2, "Titulo e obrigatorio.").max(160),
  subtitle: z.preprocess(emptyToUndefined, z.string().max(220).optional()),
  content: z.preprocess(emptyToUndefined, z.string().max(2500).optional()),
  buttonLabel: z.preprocess(emptyToUndefined, z.string().max(80).optional()),
  buttonUrl: z.preprocess(emptyToUndefined, z.string().max(500).optional()),
  order: z.coerce.number().int().min(0),
  isActive: z.boolean(),
});

export const sectionIdParamsSchema = z.object({
  id: z.string().min(1, "ID da secao e obrigatorio."),
});
