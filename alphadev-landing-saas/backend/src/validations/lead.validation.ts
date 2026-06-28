import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

export const publicLeadSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres.").max(100),
  phone: z.string().min(8, "Telefone deve ter pelo menos 8 caracteres.").max(20),
  email: z.preprocess(emptyToUndefined, z.string().email("Informe um e-mail valido.").optional()),
  message: z.preprocess(emptyToUndefined, z.string().max(1000).optional()),
  source: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  utmSource: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  utmMedium: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  utmCampaign: z.preprocess(emptyToUndefined, z.string().max(100).optional()),
  website: z.preprocess(emptyToUndefined, z.string().max(200).optional()),
});

export const adminLeadFiltersSchema = z.object({
  search: z.preprocess(emptyToUndefined, z.string().max(120).optional()),
  startDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  endDate: z.preprocess(emptyToUndefined, z.coerce.date().optional()),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const leadIdParamsSchema = z.object({
  id: z.string().min(1, "ID do lead e obrigatorio."),
});
