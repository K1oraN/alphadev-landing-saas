import type { Prisma } from "@prisma/client";
import { HttpError } from "../lib/httpError.js";
import { prisma } from "../lib/prisma.js";

export type LeadFilters = {
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page: number;
  limit: number;
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

function buildWhere(landingPageId: string, filters: LeadFilters): Prisma.LeadWhereInput {
  const where: Prisma.LeadWhereInput = {
    landingPageId,
  };

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { phone: { contains: filters.search, mode: "insensitive" } },
      { email: { contains: filters.search, mode: "insensitive" } },
    ];
  }

  if (filters.startDate || filters.endDate) {
    where.createdAt = {};

    if (filters.startDate) {
      where.createdAt.gte = filters.startDate;
    }

    if (filters.endDate) {
      const endDate = new Date(filters.endDate);
      endDate.setHours(23, 59, 59, 999);
      where.createdAt.lte = endDate;
    }
  }

  return where;
}

export async function listLeads(ownerId: string, filters: LeadFilters) {
  const landing = await getOwnedLandingOrThrow(ownerId);
  const where = buildWhere(landing.id, filters);
  const skip = (filters.page - 1) * filters.limit;

  const [leads, total] = await Promise.all([
    prisma.lead.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      skip,
      take: filters.limit,
    }),
    prisma.lead.count({ where }),
  ]);

  return {
    leads,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / filters.limit)),
    },
  };
}

export async function getLeadById(ownerId: string, leadId: string) {
  const lead = await prisma.lead.findFirst({
    where: {
      id: leadId,
      landingPage: {
        ownerId,
      },
    },
  });

  if (!lead) {
    throw new HttpError(404, "Lead nao encontrado.");
  }

  return lead;
}

export async function deleteLead(ownerId: string, leadId: string) {
  const lead = await getLeadById(ownerId, leadId);

  await prisma.lead.delete({
    where: {
      id: lead.id,
    },
  });
}
