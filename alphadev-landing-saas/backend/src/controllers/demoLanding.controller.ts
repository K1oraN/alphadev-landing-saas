import type { NextFunction, Request, Response } from "express";
import { getDemoLanding } from "../services/demoLanding.service.js";

export async function demoLandingController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const landing = await getDemoLanding();

    if (!landing) {
      return response.status(404).json({
        status: "error",
        message: "Landing demo nao encontrada. Rode npm run seed no backend.",
      });
    }

    const { _count, ...landingData } = landing;

    return response.status(200).json({
      ...landingData,
      leadsCount: _count.leads,
    });
  } catch (error) {
    return next(error);
  }
}
