import apiKeyModel from "../models/apiKeyModel";
import { ErrorResponse } from "../core/errorResponse";

async function findById(key: string | number) {
  try {
    return await apiKeyModel.findOne({ key, status: true }).lean();
    // @ts-ignore
  } catch (e: Error) {
    throw new ErrorResponse(e.message, e.status);
  }
}

module.exports = {
  findById,
};
