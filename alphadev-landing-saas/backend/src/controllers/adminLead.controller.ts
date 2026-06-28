import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import { deleteLead, getLeadById, listLeads } from "../services/adminLead.service.js";
import { adminLeadFiltersSchema, leadIdParamsSchema } from "../validations/lead.validation.js";

function getUserId(request: Request) {
  if (!request.user) {
    throw new HttpError(401, "Usuario nao autenticado.");
  }

  return request.user.id;
}

export async function listLeadsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedQuery = adminLeadFiltersSchema.safeParse(request.query);

    if (!parsedQuery.success) {
      return response.status(400).json({
        message: parsedQuery.error.issues[0]?.message ?? "Filtros invalidos.",
      });
    }

    const result = await listLeads(getUserId(request), parsedQuery.data);

    return response.status(200).json(result);
  } catch (error) {
    return next(error);
  }
}

export async function getLeadByIdController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = leadIdParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return response.status(400).json({
        message: "ID do lead invalido.",
      });
    }

    const lead = await getLeadById(getUserId(request), parsedParams.data.id);

    return response.status(200).json({
      lead,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteLeadController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = leadIdParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return response.status(400).json({
        message: "ID do lead invalido.",
      });
    }

    await deleteLead(getUserId(request), parsedParams.data.id);

    return response.status(200).json({
      message: "Lead removido com sucesso.",
    });
  } catch (error) {
    return next(error);
  }
}
