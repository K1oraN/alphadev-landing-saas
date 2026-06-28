import type { NextFunction, Request, Response } from "express";
import { createLeadByLandingSlug } from "../services/publicLead.service.js";
import { publicLeadSchema } from "../validations/lead.validation.js";
import { publicLandingParamsSchema } from "../validations/publicLanding.validation.js";

export async function createPublicLeadController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = publicLandingParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return response.status(400).json({
        message: parsedParams.error.issues[0]?.message ?? "Slug invalido.",
      });
    }

    const parsedBody = publicLeadSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const { website, ...leadData } = parsedBody.data;

    if (website) {
      return response.status(200).json({
        message: "Mensagem enviada com sucesso.",
      });
    }

    const result = await createLeadByLandingSlug(parsedParams.data.slug, leadData);

    return response.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}
