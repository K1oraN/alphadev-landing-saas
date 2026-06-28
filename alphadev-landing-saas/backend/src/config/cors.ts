import type { CorsOptions } from "cors";
import { env } from "./env.js";

const allowedOrigins = [env.FRONTEND_URL, env.FRONTEND_URL_ALT].filter(Boolean);

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
};
