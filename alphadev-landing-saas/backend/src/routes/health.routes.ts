import { Router } from "express";
import { healthController, healthDbController } from "../controllers/health.controller.js";

export const healthRoutes = Router();

healthRoutes.get("/health", healthController);
healthRoutes.get("/health/db", healthDbController);
