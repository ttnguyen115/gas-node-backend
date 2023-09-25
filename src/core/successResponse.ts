import { ReasonPhrases, StatusCodes } from "../utils/httpStatusCode";
import { Response } from "express";

interface ISuccessResponse {
  message: string;
  statusCode?: number;
  reasonStatusCode?: string;
  metadata: any;
}

interface ICreatedResponse extends ISuccessResponse {
  options: any;
}

class SuccessResponse {
  private message: string;
  private status: number;
  private metadata: any;

  constructor({
    message,
    statusCode = StatusCodes.OK,
    reasonStatusCode = ReasonPhrases.OK,
    metadata = {},
  }: ISuccessResponse) {
    this.message = message || reasonStatusCode;
    this.status = statusCode;
    this.metadata = metadata;
  }

  send(res: Response, headers: any = {}): Response {
    return res.status(this.status).json(this);
  }
}

/*
 * Only use in Controllers for response
 */
class Ok extends SuccessResponse {
  constructor({ message, metadata }: { message: string; metadata: any }) {
    super({ message, metadata });
  }
}

class Created extends SuccessResponse {
  private options: any;

  constructor({
    message,
    statusCode = StatusCodes.CREATED,
    reasonStatusCode = ReasonPhrases.CREATED,
    metadata,
    options = {},
  }: ICreatedResponse) {
    super({ message, statusCode, reasonStatusCode, metadata });
    this.options = options;
  }
}

module.exports = {
  Ok,
  Created,
};
