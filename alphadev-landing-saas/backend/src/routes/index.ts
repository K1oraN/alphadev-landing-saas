import { Router } from "express";
import { demoRoutes } from "./demo.routes.js";
import { healthRoutes } from "./health.routes.js";
import { publicRoutes } from "./public.routes.js";

export const routes = Router();

routes.use(healthRoutes);
routes.use(demoRoutes);
routes.use(publicRoutes);
