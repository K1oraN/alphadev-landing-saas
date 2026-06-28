import { api } from "./api";
import type { PublicLandingResponse } from "../types/landing";

export async function getPublicLandingBySlug(slug: string) {
  const response = await api.get<PublicLandingResponse>(`/api/public/landings/${slug}`);

  return response.data;
}
