import _ from "lodash";
import { Types } from "mongoose";

const convertToObjectIdMongodb = (id: number) => new Types.ObjectId(id);

function getInfoData({ fields = [], object = {} }) {
  return _.pick(object, fields);
}

/**
 * @desc Convert ["a", "b"] to { a: 1, b: 1 }
 * @param {[p: string]} select
 * @returns {{[p: string]: number}}
 */
function getSelectData(select: never[] = []): { [k: string]: number } {
  return Object.fromEntries(select.map((el) => [el, 1]));
}

/**
 * @desc Convert ["a", "b"] to { a: 0, b: 0 }
 * @param {[p: string]} select
 * @returns {{[p: string]: number}}
 */
function getUnselectData(select: never[] = []): { [k: string]: number } {
  return Object.fromEntries(select.map((el) => [el, 0]));
}

/**
 * @desc Remove null attributes
 * @param {{any: any}} obj
 * @returns {{any: any}} obj
 */
function removeNullObject(obj: never): {} {
  Object.keys(obj).forEach((key) => {
    if (obj[key] && typeof obj[key] === "object") removeNullObject(obj[key]);
    else if (obj[key] == null) delete obj[key];
  });
  return obj;
}

/**
 * @desc Convert const obj = { a: { b: 1, c: 2 } } to { `a.b`: 1, `a.c`: 2 }
 * @param {{any: any}} obj
 * @returns {{any: any}} finalObj
 */
function updateNestedObjectParser(obj: never): {} {
  const finalObj = {};
  Object.keys(obj || {}).forEach((key) => {
    if (typeof obj[key] === "object" && !Array.isArray(obj[key])) {
      const res = updateNestedObjectParser(obj[key]);
      Object.keys(res || {}).forEach((resKey) => {
        // @ts-ignore
        finalObj[`${key}.${resKey}`] = res[resKey];
      });
    } else {
      // @ts-ignore
      finalObj[key] = obj[key];
    }
  });
  return finalObj;
}

export {
  getInfoData,
  getSelectData,
  getUnselectData,
  removeNullObject,
  updateNestedObjectParser,
  convertToObjectIdMongodb,
};
