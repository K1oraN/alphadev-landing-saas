import { API_BASE_URL } from "../services/api";

export function getImageUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  if (url.startsWith("/")) {
    return API_BASE_URL ? `${API_BASE_URL}${url}` : url;
  }

  return url;
}
