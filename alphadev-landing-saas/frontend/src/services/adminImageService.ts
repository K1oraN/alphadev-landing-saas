import { api } from "./api";
import type { LandingImage, UpdateImagePayload, UploadImagePayload } from "../types/image";

export async function getImages() {
  const response = await api.get<{ images: LandingImage[] }>("/api/admin/images");

  return response.data.images;
}

export async function uploadImage(payload: UploadImagePayload) {
  const formData = new FormData();

  formData.append("image", payload.image);
  formData.append("type", payload.type);

  if (payload.alt) formData.append("alt", payload.alt);
  if (payload.sectionId) formData.append("sectionId", payload.sectionId);
  if (payload.order !== undefined) formData.append("order", String(payload.order));

  const response = await api.post("/api/admin/images", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data;
}

export async function updateImage(id: string, data: UpdateImagePayload) {
  const response = await api.patch(`/api/admin/images/${id}`, data);

  return response.data;
}

export async function deleteImage(id: string) {
  const response = await api.delete(`/api/admin/images/${id}`);

  return response.data;
}
