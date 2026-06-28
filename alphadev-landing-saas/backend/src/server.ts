import cors from "cors";
import express from "express";
import helmet from "helmet";
import { uploadsRoot, ensureUploadDirectories } from "./services/storage.service.js";
import { corsOptions } from "./config/cors.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { routes } from "./routes/index.js";

const app = express();

await ensureUploadDirectories();

app.set("trust proxy", 1);
app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  }),
);
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use("/uploads", express.static(uploadsRoot));
app.use(routes);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`AlphaDev Landing SaaS API running on port ${env.PORT}`);
  console.log(`Environment: ${env.NODE_ENV}`);
});
