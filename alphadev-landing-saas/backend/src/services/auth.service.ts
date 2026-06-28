import bcrypt from "bcryptjs";
import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../config/env.js";
import { HttpError } from "../lib/httpError.js";
import { prisma } from "../lib/prisma.js";

const invalidLoginMessage = "Nao foi possivel entrar. Confira seu e-mail e senha.";

type JwtPayload = {
  sub: string;
};

function sanitizeUser(user: {
  id: string;
  name: string;
  email: string;
  role: "OWNER" | "ADMIN";
  status: "ACTIVE" | "INACTIVE" | "BLOCKED";
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    status: user.status,
  };
}

export async function login(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user) {
    throw new HttpError(401, invalidLoginMessage);
  }

  if (user.status !== "ACTIVE") {
    throw new HttpError(403, "Usuario inativo ou bloqueado.");
  }

  const passwordMatches = await bcrypt.compare(password, user.passwordHash);

  if (!passwordMatches) {
    throw new HttpError(401, invalidLoginMessage);
  }

  const token = jwt.sign(
    {},
    env.JWT_SECRET as Secret,
    {
      subject: user.id,
      expiresIn: env.JWT_EXPIRES_IN,
    } as SignOptions,
  );

  return {
    user: sanitizeUser(user),
    token,
  };
}

export async function getAuthenticatedUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  if (!user) {
    throw new HttpError(401, "Usuario autenticado nao encontrado.");
  }

  if (user.status !== "ACTIVE") {
    throw new HttpError(403, "Usuario inativo ou bloqueado.");
  }

  return sanitizeUser(user);
}

export function verifyAuthToken(token: string) {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET as Secret) as JwtPayload;

    if (!payload.sub) {
      throw new HttpError(401, "Token invalido.");
    }

    return payload.sub;
  } catch (error) {
    if (error instanceof HttpError) {
      throw error;
    }

    throw new HttpError(401, "Token ausente ou invalido.");
  }
}
