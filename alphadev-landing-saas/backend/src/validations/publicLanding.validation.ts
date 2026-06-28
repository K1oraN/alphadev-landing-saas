import { z } from "zod";

export const publicLandingParamsSchema = z.object({
  slug: z
    .string()
    .min(3, "Slug deve ter pelo menos 3 caracteres.")
    .max(80, "Slug deve ter no maximo 80 caracteres.")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug invalido. Use letras minusculas, numeros e hifens.",
    ),
});
