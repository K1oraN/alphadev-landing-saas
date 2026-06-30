import axios from "axios";

export const AUTH_TOKEN_KEY = "alphadev_landing_token";
const rawApiUrl = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
export const API_BASE_URL = rawApiUrl === "/api" ? "" : rawApiUrl;

export const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(AUTH_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAdminRoute = window.location.pathname.startsWith("/admin");

    if (error.response?.status === 401 && isAdminRoute) {
      localStorage.removeItem(AUTH_TOKEN_KEY);

      if (window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }

    return Promise.reject(error);
  },
);
