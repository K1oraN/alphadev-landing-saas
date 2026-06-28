import type { CorsOptions } from "cors";

const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

export const corsOptions: CorsOptions = {
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed by CORS"));
  },
};
