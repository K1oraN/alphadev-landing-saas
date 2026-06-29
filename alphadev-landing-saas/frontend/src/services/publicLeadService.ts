import { api } from "./api";
import type { PublicLeadPayload } from "../types/lead";

export async function createLeadForMainLanding(data: PublicLeadPayload) {
  const response = await api.post<{ message: string }>("/api/public/landing/leads", data);

  return response.data;
}

export async function createLead(slug: string, data: PublicLeadPayload) {
  const response = await api.post<{ message: string }>(
    `/api/public/landings/${slug}/leads`,
    data,
  );

  return response.data;
}
