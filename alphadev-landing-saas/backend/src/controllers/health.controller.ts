import type { Request, Response } from "express";

export function healthController(_request: Request, response: Response) {
  return response.status(200).json({
    status: "ok",
    message: "AlphaDev Landing SaaS API online",
  });
}
