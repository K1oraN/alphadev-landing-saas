import { api, AUTH_TOKEN_KEY } from "./api";
import type { LoginResponse, MeResponse } from "../types/auth";

export async function login(email: string, password: string) {
  const response = await api.post<LoginResponse>("/api/auth/login", {
    email,
    password,
  });

  localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);

  return response.data;
}

export async function getMe() {
  const response = await api.get<MeResponse>("/api/auth/me");

  return response.data.user;
}

export function logout() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
}

export function getStoredToken() {
  return localStorage.getItem(AUTH_TOKEN_KEY);
}
