import { ReasonPhrases, StatusCodes } from "../utils/httpStatusCode";

class ErrorResponse extends Error {
  private status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

/*
 * Only use in Services for response
 */
class BadRequestRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.BAD_REQUEST,
    status = StatusCodes.BAD_REQUEST,
  ) {
    super(message, status);
  }
}

class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    status = StatusCodes.FORBIDDEN,
  ) {
    super(message, status);
  }
}

class PermissionRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.FORBIDDEN,
    status = StatusCodes.FORBIDDEN,
  ) {
    super(message, status);
  }
}

class NotFoundRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.NOT_FOUND,
    status = StatusCodes.NOT_FOUND,
  ) {
    super(message, status);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(message = ReasonPhrases.CONFLICT, status = StatusCodes.CONFLICT) {
    super(message, status);
  }
}

class InternalServerRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.INTERNAL_SERVER_ERROR,
    status = StatusCodes.INTERNAL_SERVER_ERROR,
  ) {
    super(message, status);
  }
}

class UnauthorizedRequestError extends ErrorResponse {
  constructor(
    message = ReasonPhrases.UNAUTHORIZED,
    status = StatusCodes.UNAUTHORIZED,
  ) {
    super(message, status);
  }
}

export {
  ErrorResponse,
  BadRequestRequestError,
  ForbiddenRequestError,
  PermissionRequestError,
  NotFoundRequestError,
  ConflictRequestError,
  InternalServerRequestError,
  UnauthorizedRequestError,
};
