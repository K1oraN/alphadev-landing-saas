import { api } from "./api";
import type {
  AdminLandingResponse,
  LandingSectionPayload,
  UpdateLandingMainPayload,
  UpdateSeoPayload,
  UpdateThemePayload,
  UpdateWhatsappPayload,
} from "../types/adminLanding";
import type { LandingSection } from "../types/landing";

export async function getMyLanding() {
  const response = await api.get<AdminLandingResponse>("/api/admin/landing/me");

  return response.data.landing;
}

export async function updateLandingMain(data: UpdateLandingMainPayload) {
  const response = await api.put("/api/admin/landing/main", data);

  return response.data;
}

export async function updateTheme(data: UpdateThemePayload) {
  const response = await api.put("/api/admin/landing/theme", data);

  return response.data;
}

export async function updateWhatsapp(data: UpdateWhatsappPayload) {
  const response = await api.put("/api/admin/landing/whatsapp", data);

  return response.data;
}

export async function updateSeo(data: UpdateSeoPayload) {
  const response = await api.put("/api/admin/landing/seo", data);

  return response.data;
}

export async function getSections() {
  const response = await api.get<{ sections: LandingSection[] }>("/api/admin/landing/sections");

  return response.data.sections;
}

export async function createSection(data: LandingSectionPayload) {
  const response = await api.post("/api/admin/landing/sections", data);

  return response.data;
}

export async function updateSection(id: string, data: LandingSectionPayload) {
  const response = await api.put(`/api/admin/landing/sections/${id}`, data);

  return response.data;
}

export async function deleteSection(id: string) {
  const response = await api.delete(`/api/admin/landing/sections/${id}`);

  return response.data;
}

export async function toggleSection(id: string) {
  const response = await api.patch(`/api/admin/landing/sections/${id}/toggle`);

  return response.data;
}
