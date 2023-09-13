"use strict";

const apiKeyModel = require("../models/apiKeyModel");

async function findById(key) {
  try {
    const keyObj = await apiKeyModel.findOne({ key, status: true }).lean();
    return keyObj;
  } catch (e) {
    console.log(e);
  }
}

module.exports = {
  findById,
};
