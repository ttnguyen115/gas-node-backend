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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = exports.authenticationV2 = exports.authentication = exports.generateTokenPairs = exports.createTokenPair = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_crypto_1 = __importDefault(require("node:crypto"));
const asyncHandler_1 = require("../helpers/asyncHandler");
const keyTokenService_1 = require("../services/keyTokenService");
const HeaderConstant_1 = require("./HeaderConstant");
const errorResponse_1 = require("../core/errorResponse");
const createTokenPair = (payload, publicKey, privateKey) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const accessToken = yield jsonwebtoken_1.default.sign(payload, publicKey, generateJwtSignOpts("2 days"));
        const refreshToken = yield jsonwebtoken_1.default.sign(payload, privateKey, generateJwtSignOpts("7 days"));
        jsonwebtoken_1.default.verify(accessToken, publicKey, (error, decode) => {
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
exports.createTokenPair = createTokenPair;
const generateJwtSignOpts = (days) => {
    return { expiresIn: days };
};
const generateTokenPairs = () => __awaiter(void 0, void 0, void 0, function* () {
    return {
        privateKey: (yield node_crypto_1.default).randomBytes(64).toString("hex"),
        publicKey: (yield node_crypto_1.default).randomBytes(64).toString("hex"),
    };
});
exports.generateTokenPairs = generateTokenPairs;
/*
 * This function is used for validating request.
 */
const authentication = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = (_a = req.headers[HeaderConstant_1.HEADER.CLIENT_ID]) === null || _a === void 0 ? void 0 : _a.toString();
    if (!userId)
        throw new errorResponse_1.UnauthorizedRequestError("User ID is missing.");
    const keyStore = yield (0, keyTokenService_1.findByUserId)(userId);
    if (!keyStore)
        throw new errorResponse_1.NotFoundRequestError("KeyStore not found.");
    const accessToken = (_b = req.headers[HeaderConstant_1.HEADER.AUTHORIZATION]) === null || _b === void 0 ? void 0 : _b.toString();
    if (!accessToken)
        throw new errorResponse_1.UnauthorizedRequestError("Access token is missing.");
    try {
        const decodeUser = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId)
            throw new errorResponse_1.UnauthorizedRequestError("User ID is invalid");
        req.keyStore = keyStore;
        return next();
    }
    catch (error) {
        throw error;
    }
}));
exports.authentication = authentication;
const authenticationV2 = (0, asyncHandler_1.asyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _c, _d;
    const userId = (_c = req.headers[HeaderConstant_1.HEADER.CLIENT_ID]) === null || _c === void 0 ? void 0 : _c.toString();
    if (!userId)
        throw new errorResponse_1.UnauthorizedRequestError("User ID is missing.");
    const keyStore = yield (0, keyTokenService_1.findByUserId)(userId);
    if (!keyStore)
        throw new errorResponse_1.NotFoundRequestError("KeyStore not found.");
    if (req.headers[HeaderConstant_1.HEADER.REFRESHTOKEN]) {
        const refreshToken = req.headers[HeaderConstant_1.HEADER.REFRESHTOKEN];
        try {
            const decodeUser = jsonwebtoken_1.default.verify(refreshToken, keyStore.privateKey);
            if (userId !== decodeUser.userId)
                throw new errorResponse_1.UnauthorizedRequestError("User ID is invalid");
            req.keyStore = keyStore;
            req.user = decodeUser;
            req.refreshToken = refreshToken;
            return next();
        }
        catch (error) {
            throw error;
        }
    }
    const accessToken = (_d = req.headers[HeaderConstant_1.HEADER.AUTHORIZATION]) === null || _d === void 0 ? void 0 : _d.toString();
    if (!accessToken)
        throw new errorResponse_1.UnauthorizedRequestError("Access token is missing.");
    try {
        const decodeUser = jsonwebtoken_1.default.verify(accessToken, keyStore.publicKey);
        if (userId !== decodeUser.userId)
            throw new errorResponse_1.UnauthorizedRequestError("User ID is invalid");
        req.keyStore = keyStore;
        req.user = decodeUser;
        return next();
    }
    catch (error) {
        throw error;
    }
}));
exports.authenticationV2 = authenticationV2;
const verifyJwt = (token, keySecret) => __awaiter(void 0, void 0, void 0, function* () {
    return jsonwebtoken_1.default.verify(token, keySecret);
});
exports.verifyJwt = verifyJwt;
