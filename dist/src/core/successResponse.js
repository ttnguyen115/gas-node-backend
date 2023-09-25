"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const httpStatusCode_1 = require("../utils/httpStatusCode");
class SuccessResponse {
    constructor({ message, statusCode = httpStatusCode_1.StatusCodes.OK, reasonStatusCode = httpStatusCode_1.ReasonPhrases.OK, metadata = {}, }) {
        this.message = message || reasonStatusCode;
        this.status = statusCode;
        this.metadata = metadata;
    }
    send(res, headers = {}) {
        return res.status(this.status).json(this);
    }
}
/*
 * Only use in Controllers for response
 */
class Ok extends SuccessResponse {
    constructor({ message, metadata }) {
        super({ message, metadata });
    }
}
class Created extends SuccessResponse {
    constructor({ message, statusCode = httpStatusCode_1.StatusCodes.CREATED, reasonStatusCode = httpStatusCode_1.ReasonPhrases.CREATED, metadata, options = {}, }) {
        super({ message, statusCode, reasonStatusCode, metadata });
        this.options = options;
    }
}
module.exports = {
    Ok,
    Created,
};
