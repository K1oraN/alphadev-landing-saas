import { isAxiosError } from "axios";

export function getErrorMessage(error: unknown, fallback = "Nao foi possivel concluir a acao.") {
  if (isAxiosError(error) && error.response?.data?.message) {
    return String(error.response.data.message);
  }

  return fallback;
}
