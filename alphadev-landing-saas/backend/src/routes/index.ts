import { Router } from "express";
import { adminLandingRoutes } from "./adminLanding.routes.js";
import { authRoutes } from "./auth.routes.js";
import { demoRoutes } from "./demo.routes.js";
import { healthRoutes } from "./health.routes.js";
import { publicRoutes } from "./public.routes.js";

export const routes = Router();

routes.use(healthRoutes);
routes.use(demoRoutes);
routes.use(publicRoutes);
routes.use(authRoutes);
routes.use(adminLandingRoutes);
