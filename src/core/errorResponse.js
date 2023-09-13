"use strict";

const ErrorStatusCode = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  PERMISSION: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
};

const ReasonErrorStatusCode = {
  BAD_REQUEST: "Bad request.",
  FORBIDDEN: "Forbidden access.",
  PERMISSION: "Permission denied.",
  NOT_FOUND: "Not Found.",
  CONFLICT: "Permissions denied.",
  INTERNAL_SERVER: "Internal Server Error",
};

class ErrorResponse extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

/*
 * Only use in Services for response
 */
class BadRequestRequestError extends ErrorResponse {
  constructor(
    message = ReasonErrorStatusCode.BAD_REQUEST,
    status = ErrorStatusCode.BAD_REQUEST,
  ) {
    super(message, status);
  }
}

class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = ReasonErrorStatusCode.FORBIDDEN,
    status = ErrorStatusCode.FORBIDDEN,
  ) {
    super(message, status);
  }
}

class PermissionRequestError extends ErrorResponse {
  constructor(
    message = ReasonErrorStatusCode.PERMISSION,
    status = ErrorStatusCode.PERMISSION,
  ) {
    super(message, status);
  }
}

class NotFoundRequestError extends ErrorResponse {
  constructor(
    message = ReasonErrorStatusCode.NOT_FOUND,
    status = ErrorStatusCode.NOT_FOUND,
  ) {
    super(message, status);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonErrorStatusCode.CONFLICT,
    status = ErrorStatusCode.CONFLICT,
  ) {
    super(message, status);
  }
}

class InternalServerRequestError extends ErrorResponse {
  constructor(
    message = ReasonErrorStatusCode.INTERNAL_SERVER,
    status = ErrorStatusCode.INTERNAL_SERVER,
  ) {
    super(message, status);
  }
}

module.exports = {
  ErrorStatusCode,
  ReasonErrorStatusCode,
  BadRequestRequestError,
  ForbiddenRequestError,
  PermissionRequestError,
  NotFoundRequestError,
  ConflictRequestError,
  InternalServerRequestError,
};
