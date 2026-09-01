// src/infra/errors.ts
export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}
export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}
export class ConflictError extends AppError {
  constructor(message: string) {
    super(409, message);
  }
}
