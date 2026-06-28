import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import {
  deleteImage,
  listImages,
  updateImage,
  uploadImage,
} from "../services/adminImage.service.js";
import {
  imageIdParamsSchema,
  updateImageSchema,
  uploadImageSchema,
} from "../validations/image.validation.js";

function getUserId(request: Request) {
  if (!request.user) {
    throw new HttpError(401, "Usuario nao autenticado.");
  }

  return request.user.id;
}

export async function listImagesController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const images = await listImages(getUserId(request));

    return response.status(200).json({
      images,
    });
  } catch (error) {
    return next(error);
  }
}

export async function uploadImageController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    if (!request.file) {
      return response.status(400).json({
        message: "Arquivo invalido. Envie uma imagem JPG, PNG ou WEBP com ate 5MB.",
      });
    }

    const parsedBody = uploadImageSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const image = await uploadImage(getUserId(request), request.file, parsedBody.data);

    return response.status(201).json({
      message: "Imagem enviada com sucesso.",
      image,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateImageController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = imageIdParamsSchema.safeParse(request.params);
    const parsedBody = updateImageSchema.safeParse(request.body);

    if (!parsedParams.success) {
      return response.status(400).json({ message: "ID da imagem invalido." });
    }

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const image = await updateImage(getUserId(request), parsedParams.data.id, parsedBody.data);

    return response.status(200).json({
      message: "Imagem atualizada com sucesso.",
      image,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteImageController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = imageIdParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return response.status(400).json({ message: "ID da imagem invalido." });
    }

    await deleteImage(getUserId(request), parsedParams.data.id);

    return response.status(200).json({
      message: "Imagem removida com sucesso.",
    });
  } catch (error) {
    return next(error);
  }
}
