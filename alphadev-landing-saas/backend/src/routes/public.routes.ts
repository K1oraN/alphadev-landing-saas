import { Router } from "express";
import {
  mainPublicLandingController,
  publicLandingController,
} from "../controllers/publicLanding.controller.js";
import { publicSitemapController } from "../controllers/publicSitemap.controller.js";

export const publicRoutes = Router();

publicRoutes.get("/api/public/sitemap", publicSitemapController);
publicRoutes.get("/api/public/landing", mainPublicLandingController);
publicRoutes.get("/api/public/landings/:slug", publicLandingController);
