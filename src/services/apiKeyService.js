"use strict";

const apiKeyModel = require("../models/apiKeyModel");
const { ErrorResponse } = require("../core/errorResponse");

async function findById(key) {
  try {
    const keyObj = await apiKeyModel.findOne({ key, status: true }).lean();
    return keyObj;
  } catch (e) {
    throw new ErrorResponse(e.message, e.status);
  }
}

module.exports = {
  findById,
};
