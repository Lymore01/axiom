export class AxiomError extends Error {
  constructor(
    public message: string,
    public status: number = 500,
    public code: string = "INTERNAL_SERVER_ERROR",
    public details?: any,
  ) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class NotFoundError extends AxiomError {
  constructor(message: string = "Resource not found", details?: any) {
    super(message, 404, "NOT_FOUND", details);
  }
}

export class UnauthorizedError extends AxiomError {
  constructor(message: string = "Unauthorized access", details?: any) {
    super(message, 401, "UNAUTHORIZED", details);
  }
}

export class BadRequestError extends AxiomError {
  constructor(message: string = "Bad request", details?: any) {
    super(message, 400, "BAD_REQUEST", details);
  }
}

export class ForbiddenError extends AxiomError {
  constructor(message: string = "Forbidden", details?: any) {
    super(message, 403, "FORBIDDEN", details);
  }
}

export class InternalServerError extends AxiomError {
  constructor(message: string = "Internal server error") {
    super(message, 500, "INTERNAL_SERVER_ERROR");
  }
}
