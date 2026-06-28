import { randomUUID } from "node:crypto";
import { mkdir, rm } from "node:fs/promises";
import { dirname, extname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const backendRoot = resolve(currentDir, "../..");
export const uploadsRoot = resolve(backendRoot, "uploads");
export const landingUploadsDir = resolve(uploadsRoot, "landings");

const mimeExtensions = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
]);

export async function ensureUploadDirectories() {
  await mkdir(landingUploadsDir, { recursive: true });
}

export function createSafeFileName(originalName: string, mimeType: string) {
  const fallbackExtension = mimeExtensions.get(mimeType) ?? ".jpg";
  const extension = extname(originalName).toLowerCase() || fallbackExtension;

  return `${randomUUID()}${extension}`;
}

export function getPublicUploadUrl(fileName: string) {
  return `/uploads/landings/${fileName}`;
}

export async function removeUploadedFile(publicUrl: string) {
  if (!publicUrl.startsWith("/uploads/landings/")) {
    return;
  }

  const fileName = publicUrl.replace("/uploads/landings/", "");

  if (!fileName || fileName.includes("/") || fileName.includes("\\")) {
    return;
  }

  const filePath = resolve(landingUploadsDir, fileName);

  if (!filePath.startsWith(landingUploadsDir)) {
    return;
  }

  await rm(filePath, { force: true });
}
