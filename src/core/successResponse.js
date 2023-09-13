"use strict";

const SuccessStatusCode = {
  Ok: 200,
  CREATED: 201,
};

const ReasonSuccessStatusCode = {
  Ok: "Success",
  CREATED: "Created",
};

class SuccessResponse {
  constructor({
    message,
    statusCode = SuccessStatusCode.Ok,
    reasonStatusCode = ReasonSuccessStatusCode.Ok,
    metadata = {},
  }) {
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
  constructor({
    message,
    statusCode = SuccessStatusCode.CREATED,
    reasonStatusCode = ReasonSuccessStatusCode.CREATED,
    metadata,
    options = {},
  }) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  SuccessStatusCode,
  ReasonSuccessStatusCode,
  Ok,
  Created,
};
