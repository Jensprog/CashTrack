/**
 * Custom error classes for structured error handling
 *
 * These classes extend the native Error class to add HTTP status codes
 * and improve error categorization throughout the application.
 */
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message) {
    super(message, 400);
  }
}

export class AuthenticationError extends AppError {
  constructor(message = 'Inte autentiserad') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Åtkomst nekad') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resursen hittades inte') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Resursen finns redan') {
    super(message, 409);
  }
}
