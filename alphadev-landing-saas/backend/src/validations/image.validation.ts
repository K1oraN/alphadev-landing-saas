import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const imageTypeSchema = z.enum(["LOGO", "HERO", "GALLERY", "TESTIMONIAL", "OTHER"]);

export const uploadImageSchema = z.object({
  type: imageTypeSchema,
  alt: z.preprocess(emptyToUndefined, z.string().max(180).optional()),
  sectionId: z.preprocess(emptyToUndefined, z.string().optional()),
  order: z.preprocess(emptyToUndefined, z.coerce.number().int().min(0).optional()),
});

export const updateImageSchema = uploadImageSchema;

export const imageIdParamsSchema = z.object({
  id: z.string().min(1, "ID da imagem e obrigatorio."),
});
