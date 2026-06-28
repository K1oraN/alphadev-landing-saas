import { Router } from "express";
import { loginController, meController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRoutes = Router();

authRoutes.post("/api/auth/login", loginController);
authRoutes.get("/api/auth/me", authMiddleware, meController);
