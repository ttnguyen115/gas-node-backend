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
const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");
const { asyncHandler } = require("../helpers/asyncHandler");
const { findByUserId } = require("../services/keyTokenService");
const { HEADER } = require("./HeaderConstant");
const { UnauthorizedRequestError, NotFoundRequestError, } = require("../core/errorResponse");
const createTokenPair = (payload, publicKey, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield JWT.sign(payload, publicKey, generateJwtSignOpts("2 days"));
        const refreshToken = yield JWT.sign(payload, privateKey, generateJwtSignOpts("7 days"));
        JWT.verify(accessToken, publicKey, (error, decode) => {
            if (error) {
                console.log("AccessToken verify error::", error);
            }
            else {
                console.log("Decode accessToken verify error::", decode);
            }
        });
        return { accessToken, refreshToken };
    }
    catch (e) {
        return e;
    }
});
const generateJwtSignOpts = (days) => {
    return { expiresIn: days };
};
const generateTokenPairs = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        privateKey: (yield crypto).randomBytes(64).toString("hex"),
        publicKey: (yield crypto).randomBytes(64).toString("hex"),
    };
});
/*
 * This function is used for validating request.
 */
const authentication = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.headers[HEADER.CLIENT_ID]) === null || _a === void 0 ? void 0 : _a.toString();
    if (!userId)
        throw new UnauthorizedRequestError("User ID is missing.");
    const keyStore = yield findByUserId(userId);
    if (!keyStore)
        throw new NotFoundRequestError("KeyStore not found.");
    const accessToken = (_b = req.headers[HEADER.AUTHORIZATION]) === null || _b === void 0 ? void 0 : _b.toString();
    if (!accessToken)
        throw new UnauthorizedRequestError("Access token is missing.");
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId)
            throw new UnauthorizedRequestError("User ID is invalid");
        req.keyStore = keyStore;
        return next();
    }
    catch (error) {
        throw error;
    }
}));
const authenticationV2 = asyncHandler((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const userId = (_c = req.headers[HEADER.CLIENT_ID]) === null || _c === void 0 ? void 0 : _c.toString();
    if (!userId)
        throw new UnauthorizedRequestError("User ID is missing.");
    const keyStore = yield findByUserId(userId);
    if (!keyStore)
        throw new NotFoundRequestError("KeyStore not found.");
    if (req.headers[HEADER.REFRESHTOKEN]) {
        const refreshToken = req.headers[HEADER.REFRESHTOKEN];
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId)
                throw new UnauthorizedRequestError("User ID is invalid");
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        }
        catch (error) {
            throw error;
        }
    }
    const accessToken = (_d = req.headers[HEADER.AUTHORIZATION]) === null || _d === void 0 ? void 0 : _d.toString();
    if (!accessToken)
        throw new UnauthorizedRequestError("Access token is missing.");
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId)
            throw new UnauthorizedRequestError("User ID is invalid");
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    }
    catch (error) {
        throw error;
    }
}));
const verifyJwt = (token, keySecret) => __awaiter(void 0, void 0, void 0, function* () {
    return JWT.verify(token, keySecret);
});
module.exports = {
    createTokenPair,
    generateTokenPairs,
    authentication,
    authenticationV2,
    verifyJwt,
};
