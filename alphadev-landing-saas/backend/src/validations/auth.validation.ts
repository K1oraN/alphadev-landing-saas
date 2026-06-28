import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string({
      required_error: "E-mail e obrigatorio.",
    })
    .email("Informe um e-mail valido."),
  password: z
    .string({
      required_error: "Senha e obrigatoria.",
    })
    .min(6, "Senha deve ter pelo menos 6 caracteres."),
});
