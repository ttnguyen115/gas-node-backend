"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedRequestError = exports.InternalServerRequestError = exports.ConflictRequestError = exports.NotFoundRequestError = exports.PermissionRequestError = exports.ForbiddenRequestError = exports.BadRequestRequestError = exports.ErrorResponse = void 0;
const httpStatusCode_1 = require("../utils/httpStatusCode");
class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status;
    }
}
exports.ErrorResponse = ErrorResponse;
/*
 * Only use in Services for response
 */
class BadRequestRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.ReasonPhrases.BAD_REQUEST, status = httpStatusCode_1.StatusCodes.BAD_REQUEST) {
        super(message, status);
    }
}
exports.BadRequestRequestError = BadRequestRequestError;
class ForbiddenRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.ReasonPhrases.FORBIDDEN, status = httpStatusCode_1.StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}
exports.ForbiddenRequestError = ForbiddenRequestError;
class PermissionRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.ReasonPhrases.FORBIDDEN, status = httpStatusCode_1.StatusCodes.FORBIDDEN) {
        super(message, status);
    }
}
exports.PermissionRequestError = PermissionRequestError;
class NotFoundRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.ReasonPhrases.NOT_FOUND, status = httpStatusCode_1.StatusCodes.NOT_FOUND) {
        super(message, status);
    }
}
exports.NotFoundRequestError = NotFoundRequestError;
class ConflictRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.ReasonPhrases.CONFLICT, status = httpStatusCode_1.StatusCodes.CONFLICT) {
        super(message, status);
    }
}
exports.ConflictRequestError = ConflictRequestError;
class InternalServerRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.ReasonPhrases.INTERNAL_SERVER_ERROR, status = httpStatusCode_1.StatusCodes.INTERNAL_SERVER_ERROR) {
        super(message, status);
    }
}
exports.InternalServerRequestError = InternalServerRequestError;
class UnauthorizedRequestError extends ErrorResponse {
    constructor(message = httpStatusCode_1.ReasonPhrases.UNAUTHORIZED, status = httpStatusCode_1.StatusCodes.UNAUTHORIZED) {
        super(message, status);
    }
}
exports.UnauthorizedRequestError = UnauthorizedRequestError;
