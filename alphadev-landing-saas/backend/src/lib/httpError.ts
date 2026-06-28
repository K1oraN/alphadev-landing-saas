import { AppError } from "../utils/AppError.js";

export class HttpError extends AppError {
  constructor(statusCode: number, message: string, details?: unknown[]) {
    super(message, statusCode, details);
  }
}
