import type { LandingImageType } from "@prisma/client";
import { HttpError } from "../lib/httpError.js";
import { prisma } from "../lib/prisma.js";
import { getPublicUploadUrl, removeUploadedFile } from "./storage.service.js";

export type ImageMetadata = {
  type: LandingImageType;
  alt?: string;
  sectionId?: string;
  order?: number;
};

async function getOwnedLandingOrThrow(ownerId: string) {
  const landing = await prisma.landingPage.findFirst({
    where: {
      ownerId,
    },
    select: {
      id: true,
    },
  });

  if (!landing) {
    throw new HttpError(404, "Nenhuma landing encontrada para este usuario.");
  }

  return landing;
}

async function ensureSectionBelongsToLanding(landingPageId: string, sectionId?: string) {
  if (!sectionId) {
    return;
  }

  const section = await prisma.landingSection.findFirst({
    where: {
      id: sectionId,
      landingPageId,
    },
    select: {
      id: true,
    },
  });

  if (!section) {
    throw new HttpError(400, "Secao informada nao pertence a sua landing.");
  }
}

async function removeSingleImageSiblings(landingPageId: string, type: LandingImageType, exceptId?: string) {
  if (type !== "LOGO" && type !== "HERO") {
    return;
  }

  const images = await prisma.landingImage.findMany({
    where: {
      landingPageId,
      type,
      id: exceptId ? { not: exceptId } : undefined,
    },
  });

  for (const image of images) {
    await prisma.landingImage.delete({
      where: {
        id: image.id,
      },
    });
    await removeUploadedFile(image.url);
  }
}

export async function listImages(ownerId: string) {
  const landing = await getOwnedLandingOrThrow(ownerId);

  return prisma.landingImage.findMany({
    where: {
      landingPageId: landing.id,
    },
    orderBy: [{ type: "asc" }, { order: "asc" }, { createdAt: "desc" }],
  });
}

export async function uploadImage(ownerId: string, file: Express.Multer.File, data: ImageMetadata) {
  const landing = await getOwnedLandingOrThrow(ownerId);

  await ensureSectionBelongsToLanding(landing.id, data.sectionId);
  await removeSingleImageSiblings(landing.id, data.type);

  const image = await prisma.landingImage.create({
    data: {
      landingPageId: landing.id,
      sectionId: data.sectionId,
      url: getPublicUploadUrl(file.filename),
      alt: data.alt || file.originalname,
      type: data.type,
      order: data.order ?? 0,
    },
  });

  return image;
}

async function getOwnedImageOrThrow(ownerId: string, imageId: string) {
  const image = await prisma.landingImage.findFirst({
    where: {
      id: imageId,
      landingPage: {
        ownerId,
      },
    },
  });

  if (!image) {
    throw new HttpError(404, "Imagem nao encontrada para esta landing.");
  }

  return image;
}

export async function updateImage(ownerId: string, imageId: string, data: ImageMetadata) {
  const image = await getOwnedImageOrThrow(ownerId, imageId);

  await ensureSectionBelongsToLanding(image.landingPageId, data.sectionId);
  await removeSingleImageSiblings(image.landingPageId, data.type, image.id);

  return prisma.landingImage.update({
    where: {
      id: image.id,
    },
    data: {
      type: data.type,
      alt: data.alt || image.alt,
      sectionId: data.sectionId,
      order: data.order ?? image.order,
    },
  });
}

export async function deleteImage(ownerId: string, imageId: string) {
  const image = await getOwnedImageOrThrow(ownerId, imageId);

  await prisma.landingImage.delete({
    where: {
      id: image.id,
    },
  });

  await removeUploadedFile(image.url);
}
