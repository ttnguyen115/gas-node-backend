"use strict";

const _ = require("lodash");

function getInfoData({ fields = [], object = {} }) {
  return _.pick(object, fields);
}

module.exports = {
  getInfoData,
};
