import { Router } from "express";
import { demoLandingController } from "../controllers/demoLanding.controller.js";

export const demoRoutes = Router();

demoRoutes.get("/api/demo/landing", demoLandingController);
