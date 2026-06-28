import { api } from "./api";
import type { AdminLead, LeadFilters, PaginatedLeadsResponse } from "../types/lead";

export async function getLeads(filters: LeadFilters = {}) {
  const response = await api.get<PaginatedLeadsResponse>("/api/admin/leads", {
    params: filters,
  });

  return response.data;
}

export async function getLeadById(id: string) {
  const response = await api.get<{ lead: AdminLead }>(`/api/admin/leads/${id}`);

  return response.data.lead;
}

export async function deleteLead(id: string) {
  const response = await api.delete<{ message: string }>(`/api/admin/leads/${id}`);

  return response.data;
}
