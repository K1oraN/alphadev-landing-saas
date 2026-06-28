import { Router } from "express";
import rateLimit from "express-rate-limit";
import { loginController, meController } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const authRoutes = Router();

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas tentativas de login. Aguarde alguns minutos.",
  },
});

authRoutes.post("/api/auth/login", loginRateLimit, loginController);
authRoutes.get("/api/auth/me", authMiddleware, meController);
