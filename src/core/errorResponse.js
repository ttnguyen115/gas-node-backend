"use strict";

const StatusCode = {
  BAD_REQUEST: 400,
  FORBIDDEN: 403,
  PERMISSION: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER: 500,
};

const ReasonStatusCode = {
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
 * Only use in Controllers for response
 */
class BadRequestRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.BAD_REQUEST,
    status = StatusCode.BAD_REQUEST,
  ) {
    super(message, status);
  }
}

class ForbiddenRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.FORBIDDEN,
    status = StatusCode.FORBIDDEN,
  ) {
    super(message, status);
  }
}

class PermissionRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.PERMISSION,
    status = StatusCode.PERMISSION,
  ) {
    super(message, status);
  }
}

class NotFoundRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.NOT_FOUND,
    status = StatusCode.NOT_FOUND,
  ) {
    super(message, status);
  }
}

class ConflictRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.CONFLICT,
    status = StatusCode.CONFLICT,
  ) {
    super(message, status);
  }
}

class InternalServerRequestError extends ErrorResponse {
  constructor(
    message = ReasonStatusCode.INTERNAL_SERVER,
    status = StatusCode.INTERNAL_SERVER,
  ) {
    super(message, status);
  }
}

module.exports = {
  StatusCode,
  ReasonStatusCode,
  BadRequestRequestError,
  ForbiddenRequestError,
  PermissionRequestError,
  NotFoundRequestError,
  ConflictRequestError,
  InternalServerRequestError,
};
