import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import { getAuthenticatedUser, verifyAuthToken } from "../services/auth.service.js";

export async function authMiddleware(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  try {
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new HttpError(401, "Token ausente ou invalido.");
    }

    const token = authorization.replace("Bearer ", "").trim();
    const userId = verifyAuthToken(token);
    const user = await getAuthenticatedUser(userId);

    request.user = user;

    return next();
  } catch (error) {
    return next(error);
  }
}
