import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import { login } from "../services/auth.service.js";
import { loginSchema } from "../validations/auth.validation.js";

export async function loginController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = loginSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({
        status: "error",
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const result = await login(parsedBody.data.email, parsedBody.data.password);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export function meController(request: Request, response: Response) {
  if (!request.user) {
    throw new HttpError(401, "Usuario nao autenticado.");
  }

  return response.status(200).json({
    user: request.user,
  });
}
