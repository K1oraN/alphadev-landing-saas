import { Router } from "express";
import {
  deleteLeadController,
  getLeadByIdController,
  listLeadsController,
} from "../controllers/adminLead.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const adminLeadRoutes = Router();

adminLeadRoutes.use("/api/admin/leads", authMiddleware);

adminLeadRoutes.get("/api/admin/leads", listLeadsController);
adminLeadRoutes.get("/api/admin/leads/:id", getLeadByIdController);
adminLeadRoutes.delete("/api/admin/leads/:id", deleteLeadController);
