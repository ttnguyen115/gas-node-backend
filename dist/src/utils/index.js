"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertToObjectIdMongodb = exports.updateNestedObjectParser = exports.removeNullObject = exports.getUnselectData = exports.getSelectData = exports.getInfoData = void 0;
const lodash_1 = __importDefault(require("lodash"));
const mongoose_1 = require("mongoose");
const convertToObjectIdMongodb = (id) => new mongoose_1.Types.ObjectId(id);
exports.convertToObjectIdMongodb = convertToObjectIdMongodb;
function getInfoData({ fields = [], object = {} }) {
    return lodash_1.default.pick(object, fields);
}
exports.getInfoData = getInfoData;
/**
 * @desc Convert ["a", "b"] to { a: 1, b: 1 }
 * @param {[p: string]} select
 * @returns {{[p: string]: number}}
 */
function getSelectData(select = []) {
    return Object.fromEntries(select.map((el) => [el, 1]));
}
exports.getSelectData = getSelectData;
/**
 * @desc Convert ["a", "b"] to { a: 0, b: 0 }
 * @param {[p: string]} select
 * @returns {{[p: string]: number}}
 */
function getUnselectData(select = []) {
    return Object.fromEntries(select.map((el) => [el, 0]));
}
exports.getUnselectData = getUnselectData;
/**
 * @desc Remove null attributes
 * @param {{any: any}} obj
 * @returns {{any: any}} obj
 */
function removeNullObject(obj) {
    Object.keys(obj).forEach((key) => {
        if (obj[key] && typeof obj[key] === "object")
            removeNullObject(obj[key]);
        else if (obj[key] == null)
            delete obj[key];
    });
    return obj;
}
exports.removeNullObject = removeNullObject;
/**
 * @desc Convert const obj = { a: { b: 1, c: 2 } } to { `a.b`: 1, `a.c`: 2 }
 * @param {{any: any}} obj
 * @returns {{any: any}} finalObj
 */
function updateNestedObjectParser(obj) {
    const finalObj = {};
    Object.keys(obj || {}).forEach((key) => {
        if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
            const res = updateNestedObjectParser(obj[key]);
            Object.keys(res || {}).forEach((resKey) => {
                // @ts-ignore
                finalObj[`${key}.${resKey}`] = res[resKey];
            });
        }
        else {
            // @ts-ignore
            finalObj[key] = obj[key];
        }
    });
    return finalObj;
}
exports.updateNestedObjectParser = updateNestedObjectParser;
