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

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use("/uploads", express.static(uploadsRoot));
app.use(routes);
app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`AlphaDev Landing SaaS API running on port ${env.PORT}`);
});
