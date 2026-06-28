import type { NextFunction, Request, Response } from "express";
import { getPublicSitemap } from "../services/publicSitemap.service.js";

export async function publicSitemapController(
  _request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const landings = await getPublicSitemap();

    return response.status(200).json({
      landings,
    });
  } catch (error) {
    return next(error);
  }
}
