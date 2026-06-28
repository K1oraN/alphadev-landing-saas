import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../lib/httpError.js";
import {
  createSection,
  deleteSection,
  getMyLanding,
  getSections,
  toggleSection,
  updateLandingMain,
  updateSection,
  upsertSeo,
  upsertTheme,
  upsertWhatsapp,
} from "../services/adminLanding.service.js";
import {
  sectionIdParamsSchema,
  sectionPayloadSchema,
  updateLandingMainSchema,
  updateSeoSchema,
  updateThemeSchema,
  updateWhatsappSchema,
} from "../validations/adminLanding.validation.js";

function getUserId(request: Request) {
  if (!request.user) {
    throw new HttpError(401, "Usuario nao autenticado.");
  }

  return request.user.id;
}

export async function getMyLandingController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const landing = await getMyLanding(getUserId(request));

    return response.status(200).json({
      landing,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateLandingMainController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = updateLandingMainSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const landing = await updateLandingMain(getUserId(request), parsedBody.data);

    return response.status(200).json({
      message: "Landing atualizada com sucesso.",
      landing,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateThemeController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = updateThemeSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const theme = await upsertTheme(getUserId(request), parsedBody.data);

    return response.status(200).json({
      message: "Tema atualizado com sucesso.",
      theme,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateWhatsappController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = updateWhatsappSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const whatsapp = await upsertWhatsapp(getUserId(request), parsedBody.data);

    return response.status(200).json({
      message: "WhatsApp atualizado com sucesso.",
      whatsapp,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateSeoController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = updateSeoSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const seo = await upsertSeo(getUserId(request), parsedBody.data);

    return response.status(200).json({
      message: "SEO atualizado com sucesso.",
      seo,
    });
  } catch (error) {
    return next(error);
  }
}

export async function getSectionsController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const sections = await getSections(getUserId(request));

    return response.status(200).json({
      sections,
    });
  } catch (error) {
    return next(error);
  }
}

export async function createSectionController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedBody = sectionPayloadSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const section = await createSection(getUserId(request), parsedBody.data);

    return response.status(201).json({
      message: "Secao criada com sucesso.",
      section,
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateSectionController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = sectionIdParamsSchema.safeParse(request.params);
    const parsedBody = sectionPayloadSchema.safeParse(request.body);

    if (!parsedParams.success) {
      return response.status(400).json({ message: "ID da secao invalido." });
    }

    if (!parsedBody.success) {
      return response.status(400).json({
        message: parsedBody.error.issues[0]?.message ?? "Dados invalidos.",
      });
    }

    const section = await updateSection(
      getUserId(request),
      parsedParams.data.id,
      parsedBody.data,
    );

    return response.status(200).json({
      message: "Secao atualizada com sucesso.",
      section,
    });
  } catch (error) {
    return next(error);
  }
}

export async function deleteSectionController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = sectionIdParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return response.status(400).json({ message: "ID da secao invalido." });
    }

    await deleteSection(getUserId(request), parsedParams.data.id);

    return response.status(200).json({
      message: "Secao removida com sucesso.",
    });
  } catch (error) {
    return next(error);
  }
}

export async function toggleSectionController(
  request: Request,
  response: Response,
  next: NextFunction,
) {
  try {
    const parsedParams = sectionIdParamsSchema.safeParse(request.params);

    if (!parsedParams.success) {
      return response.status(400).json({ message: "ID da secao invalido." });
    }

    const section = await toggleSection(getUserId(request), parsedParams.data.id);

    return response.status(200).json({
      message: section.isActive ? "Secao ativada com sucesso." : "Secao desativada com sucesso.",
      section,
    });
  } catch (error) {
    return next(error);
  }
}
