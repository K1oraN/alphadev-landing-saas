import type { CorsOptions } from "cors";
import { env } from "./env.js";

const developmentOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
];

const allowedOrigins = new Set([
  env.FRONTEND_URL,
  env.FRONTEND_URL_ALT,
  ...(env.NODE_ENV === "development" ? developmentOrigins : []),
].filter(Boolean));

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
};
