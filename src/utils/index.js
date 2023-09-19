"use strict";

const _ = require("lodash");

function getInfoData({ fields = [], object = {} }) {
  return _.pick(object, fields);
}

/**
 * @desc Convert ["a", "b"] to { a: 1, b: 1 }
 * @param {[p: string]} select
 * @returns {{[p: string]: number}}
 */
function getSelectData(select = []) {
  return Object.fromEntries(select.map((el) => [el, 1]));
}

/**
 * @desc Convert ["a", "b"] to { a: 0, b: 0 }
 * @param {[p: string]} select
 * @returns {{[p: string]: number}}
 */
function getUnselectData(select = []) {
  return Object.fromEntries(select.map((el) => [el, 0]));
}

module.exports = {
  getInfoData,
  getSelectData,
  getUnselectData,
};
