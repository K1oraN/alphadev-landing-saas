import { Router } from "express";
import {
  createSectionController,
  deleteSectionController,
  getMyLandingController,
  getSectionsController,
  toggleSectionController,
  updateLandingMainController,
  updateSectionController,
  updateSeoController,
  updateThemeController,
  updateWhatsappController,
} from "../controllers/adminLanding.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const adminLandingRoutes = Router();

adminLandingRoutes.use("/api/admin/landing", authMiddleware);

adminLandingRoutes.get("/api/admin/landing/me", getMyLandingController);
adminLandingRoutes.put("/api/admin/landing/main", updateLandingMainController);
adminLandingRoutes.put("/api/admin/landing/theme", updateThemeController);
adminLandingRoutes.put("/api/admin/landing/whatsapp", updateWhatsappController);
adminLandingRoutes.put("/api/admin/landing/seo", updateSeoController);
adminLandingRoutes.get("/api/admin/landing/sections", getSectionsController);
adminLandingRoutes.post("/api/admin/landing/sections", createSectionController);
adminLandingRoutes.put("/api/admin/landing/sections/:id", updateSectionController);
adminLandingRoutes.delete("/api/admin/landing/sections/:id", deleteSectionController);
adminLandingRoutes.patch("/api/admin/landing/sections/:id/toggle", toggleSectionController);
