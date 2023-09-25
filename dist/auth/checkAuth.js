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
const { findById } = require("../services/apiKeyService");
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
const { HEADER } = require("./HeaderConstant");
function apiKey(req, res, next) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
        const key = (_a = req.headers[HEADER.API_KEY]) === null || _a === void 0 ? void 0 : _a.toString();
        if (!key)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: ReasonPhrases.FORBIDDEN });
        const keyObj = yield findById(key);
        if (!keyObj)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: ReasonPhrases.FORBIDDEN });
        req.objKey = keyObj;
        return next();
    });
}
function permission(permissionCode) {
    return (req, res, next) => {
        if (!req.objKey.permissions)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: "Permissions denied." });
        const validPermission = req.objKey.permissions.includes(permissionCode);
        if (!validPermission)
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: "Permissions denied." });
        return next();
    };
}
module.exports = {
    apiKey,
    permission,
};
