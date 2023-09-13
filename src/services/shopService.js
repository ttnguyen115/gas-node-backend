"use strict";

const shopModel = require("../models/shopModel");

async function findByEmail({
  email,
  select = { email: 1, password: 2, name: 1, status: 1, roles: 1 },
}) {
  return shopModel.findOne({ email }).select(select).lean();
}

module.exports = {
  findByEmail,
};
