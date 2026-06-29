import type { NextFunction, Request, Response } from "express";
import {
  createLeadByLandingSlug,
  createLeadForMainLanding,
} from "../services/publicLead.service.js";
import { publicLeadSchema } from "../validations/lead.validation.js";
import { publicLandingParamsSchema } from "../validations/publicLanding.validation.js";

function parseLeadBody(request: Request, response: Response) {
  const parsedBody = publicLeadSchema.safeParse(request.body);

  if (!parsedBody.success) {
    response.status(400).json({
      message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
    });
    return null;
  }

  const { website, ...leadData } = parsedBody.data;

  if (website) {
    response.status(200).json({
      message: "Mensagem enviada com sucesso.",
    });
    return null;
  }

  return leadData;
}

export async function createMainPublicLeadController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const leadData = parseLeadBody(request, response);

    if (!leadData) {
      return;
    }

    const result = await createLeadForMainLanding(leadData);

    return response.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}

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

    const leadData = parseLeadBody(request, response);

    if (!leadData) {
      return;
    }

    const result = await createLeadByLandingSlug(parsedParams.data.slug, leadData);

    return response.status(201).json(result);
  } catch (error) {
    return next(error);
  }
}
