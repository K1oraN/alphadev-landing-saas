import type { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { env } from "../config/env.js";
import { AppError } from "../utils/AppError.js";
import { HttpError } from "../lib/httpError.js";

export const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  if (error instanceof AppError || error instanceof HttpError) {
    return response.status(error.statusCode).json({
      message: error.message,
      details: error.details ?? [],
    });
  }

  if (error instanceof ZodError) {
    return response.status(400).json({
      message: "Dados invalidos.",
      details: error.issues.map((issue) => issue.message),
    });
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return response.status(400).json({
      message: "Nao foi possivel processar a solicitacao no banco de dados.",
      details: env.NODE_ENV === "production" ? [] : [error.code],
    });
  }

  console.error(error);

  return response.status(500).json({
    message: "Erro interno do servidor.",
    details: env.NODE_ENV === "production" ? [] : [String(error)],
  });
};
