import { Router } from "express";
import { publicLandingController } from "../controllers/publicLanding.controller.js";

export const publicRoutes = Router();

publicRoutes.get("/api/public/landings/:slug", publicLandingController);
