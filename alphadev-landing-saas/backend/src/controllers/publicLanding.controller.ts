import type { NextFunction, Request, Response } from "express";
import {
  getMainPublicLanding,
  getPublicLandingBySlug,
} from "../services/publicLanding.service.js";
import { publicLandingParamsSchema } from "../validations/publicLanding.validation.js";

export async function mainPublicLandingController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const publicLanding = await getMainPublicLanding();

    if (!publicLanding) {
      return response.status(404).json({
        status: "error",
        message: "Landing principal publica nao encontrada ou indisponivel.",
      });
    }

    return response.status(200).json(publicLanding);
  } catch (error) {
    return next(error);
  }
}

export async function publicLandingController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = publicLandingParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return response.status(400).json({
        status: "error",
        message: parsedParams.error.issues[0]?.message ?? "Slug invalido.",
      });
    }

    const publicLanding = await getPublicLandingBySlug(parsedParams.data.slug);

    if (!publicLanding) {
      return response.status(404).json({
        status: "error",
        message: "Landing publica nao encontrada ou indisponivel.",
      });
    }

    return response.status(200).json(publicLanding);
  } catch (error) {
    return next(error);
  }
}
