import type { Request, Response } from "express";
import { prisma } from "../lib/prisma.js";

export function healthController(_request: Request, response: Response) {
  return response.status(200).json({
    status: "ok",
    message: "AlphaDev Landing SaaS API online",
  });
}

export async function healthDbController(_request: Request, response: Response) {
  await prisma.$queryRaw`SELECT 1`;

  return response.status(200).json({
    status: "ok",
    database: "connected",
  });
}
