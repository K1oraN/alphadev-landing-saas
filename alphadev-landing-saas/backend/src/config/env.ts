import dotenv from "dotenv";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";

const currentDir = dirname(fileURLToPath(import.meta.url));

dotenv.config({
  path: resolve(currentDir, "../../.env"),
});

const emptyStringToUndefined = (value: unknown) => (value === "" ? undefined : value);

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.coerce.number().default(3333),
  DATABASE_URL: z
    .string({
      required_error:
        "DATABASE_URL nao encontrada. Crie um arquivo .env baseado no .env.example dentro da pasta backend.",
    })
    .min(
      1,
      "DATABASE_URL vazia. Preencha a conexao PostgreSQL no arquivo .env da pasta backend.",
    ),
  JWT_SECRET: z
    .string({
      required_error:
        "JWT_SECRET nao encontrada. Adicione JWT_SECRET ao .env baseado no .env.example.",
    })
    .min(16, "JWT_SECRET deve ter pelo menos 16 caracteres."),
  JWT_EXPIRES_IN: z
    .string({
      required_error:
        "JWT_EXPIRES_IN nao encontrada. Adicione JWT_EXPIRES_IN ao .env baseado no .env.example.",
    })
    .min(1, "JWT_EXPIRES_IN nao pode ficar vazia."),
  FRONTEND_URL: z
    .string({
      required_error:
        "FRONTEND_URL nao encontrada. Adicione FRONTEND_URL ao .env baseado no .env.example.",
    })
    .url("FRONTEND_URL deve ser uma URL valida."),
  FRONTEND_URL_ALT: z.preprocess(
    emptyStringToUndefined,
    z.string().url("FRONTEND_URL_ALT deve ser uma URL valida.").optional(),
  ),
  BACKEND_PUBLIC_URL: z.preprocess(
    emptyStringToUndefined,
    z.string().url("BACKEND_PUBLIC_URL deve ser uma URL valida.").optional(),
  ),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  const messages = parsedEnv.error.issues.map((issue) => `- ${issue.message}`);

  console.error(
    [
      "Erro ao carregar variaveis de ambiente do backend.",
      "Confira se existe um arquivo .env em alphadev-landing-saas/backend baseado no .env.example.",
      ...messages,
    ].join("\n"),
  );

  process.exit(1);
}

export const env = parsedEnv.data;
