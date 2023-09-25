"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiKeyModel = require("../models/apiKeyModel");
const { ErrorResponse } = require("../core/errorResponse");
function findById(key) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const keyObj = yield apiKeyModel.findOne({ key, status: true }).lean();
            return keyObj;
        }
        catch (e) {
            throw new ErrorResponse(e.message, e.status);
        }
    });
}
module.exports = {
    findById,
};
