export type PublicLeadPayload = {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  source?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  website?: string;
};

export type AdminLead = {
  id: string;
  landingPageId: string;
  name: string;
  email: string | null;
  phone: string;
  message: string | null;
  source: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  createdAt: string;
};

export type LeadFilters = {
  search?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
};

export type PaginatedLeadsResponse = {
  leads: AdminLead[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};
