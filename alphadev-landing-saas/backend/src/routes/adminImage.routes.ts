import type { NextFunction, Request, Response } from "express";
import { Router } from "express";
import { invalidImageMessage, upload } from "../config/upload.js";
import {
  deleteImageController,
  listImagesController,
  updateImageController,
  uploadImageController,
} from "../controllers/adminImage.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

export const adminImageRoutes = Router();

function uploadSingleImage(request: Request, response: Response, next: NextFunction) {
  upload.single("image")(request, response, (error) => {
    if (error) {
      return response.status(400).json({
        message: invalidImageMessage,
      });
    }

    return next();
  });
}

adminImageRoutes.use("/api/admin/images", authMiddleware);

adminImageRoutes.get("/api/admin/images", listImagesController);
adminImageRoutes.post("/api/admin/images", uploadSingleImage, uploadImageController);
adminImageRoutes.patch("/api/admin/images/:id", updateImageController);
adminImageRoutes.delete("/api/admin/images/:id", deleteImageController);
