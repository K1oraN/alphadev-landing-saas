import { api } from "./api";
import type { PublicLeadPayload } from "../types/lead";

export async function createLead(slug: string, data: PublicLeadPayload) {
  const response = await api.post<{ message: string }>(
    `/api/public/landings/${slug}/leads`,
    data,
  );

  return response.data;
}
