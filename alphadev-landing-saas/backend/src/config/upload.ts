import multer from "multer";
import { createSafeFileName, ensureUploadDirectories, landingUploadsDir } from "../services/storage.service.js";

const allowedMimeTypes = ["image/jpeg", "image/png", "image/webp"];
export const invalidImageMessage =
  "Arquivo invalido. Envie uma imagem JPG, PNG ou WEBP com ate 5MB.";

const storage = multer.diskStorage({
  async destination(_request, _file, callback) {
    try {
      await ensureUploadDirectories();
      callback(null, landingUploadsDir);
    } catch (error) {
      callback(error as Error, landingUploadsDir);
    }
  },
  filename(_request, file, callback) {
    callback(null, createSafeFileName(file.originalname, file.mimetype));
  },
});

export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter(_request, file, callback) {
    if (!allowedMimeTypes.includes(file.mimetype)) {
      callback(new Error(invalidImageMessage));
      return;
    }

    callback(null, true);
  },
});
