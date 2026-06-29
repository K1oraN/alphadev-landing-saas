import rateLimit from "express-rate-limit";
import { Router } from "express";
import {
  createMainPublicLeadController,
  createPublicLeadController,
} from "../controllers/publicLead.controller.js";

export const publicLeadRoutes = Router();

const leadRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas tentativas. Aguarde alguns minutos antes de enviar novamente.",
  },
});

publicLeadRoutes.post("/api/public/landing/leads", leadRateLimit, createMainPublicLeadController);
publicLeadRoutes.post(
  "/api/public/landings/:slug/leads",
  leadRateLimit,
  createPublicLeadController,
);
