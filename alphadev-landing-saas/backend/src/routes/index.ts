import { Router } from "express";
import { adminImageRoutes } from "./adminImage.routes.js";
import { adminLandingRoutes } from "./adminLanding.routes.js";
import { adminLeadRoutes } from "./adminLead.routes.js";
import { authRoutes } from "./auth.routes.js";
import { demoRoutes } from "./demo.routes.js";
import { healthRoutes } from "./health.routes.js";
import { publicLeadRoutes } from "./publicLead.routes.js";
import { publicRoutes } from "./public.routes.js";

export const routes = Router();

routes.use(healthRoutes);
routes.use(demoRoutes);
routes.use(publicRoutes);
routes.use(publicLeadRoutes);
routes.use(authRoutes);
routes.use(adminLandingRoutes);
routes.use(adminImageRoutes);
routes.use(adminLeadRoutes);
