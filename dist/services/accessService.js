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
var _a;
const bcrypt = require("bcrypt");
const KeyTokenService = require("../services/keyTokenService");
const { findByEmail } = require("../services/shopService");
const shopModel = require("../models/shopModel");
const { createTokenPair, generateTokenPairs, verifyJwt, } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const { BadRequestRequestError, InternalServerRequestError, UnauthorizedRequestError, ForbiddenRequestError, } = require("../core/errorResponse");
const RoleShop = {
    SHOP: "0001",
    WRITER: "0002",
    EDITOR: "0003",
    ADMIN: "0000",
};
class AccessService {
}
_a = AccessService;
AccessService.signUp = ({ name, email, password }) => __awaiter(void 0, void 0, void 0, function* () {
    // Check if shop exists
    const holderShop = yield shopModel.findOne({ email }).lean();
    if (holderShop) {
        throw new BadRequestRequestError("Shop already registered");
    }
    // Encrypt password & create new object in shop model
    const hashPassword = yield bcrypt.hash(password, 10);
    const newShop = yield shopModel.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
    });
    if (!newShop)
        return { code: 200, metadata: null };
    // Create key-pair for each shop instance
    const { publicKey, privateKey } = yield generateTokenPairs();
    // Create publicKeyString for new shop based on publicKey from rsa
    const keyStore = yield KeyTokenService.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
    });
    if (!keyStore)
        throw new InternalServerRequestError("Generating keyStore error!");
    // Create token pairs
    const payload = { userId: newShop._id, email };
    const tokens = yield createTokenPair(payload, publicKey, privateKey);
    return {
        code: 201,
        metadata: {
            shop: getInfoData({
                fields: ["_id", "name", "email"],
                object: newShop,
            }),
            tokens,
        },
    };
});
AccessService.login = ({ email, password, refreshToken = null }) => __awaiter(void 0, void 0, void 0, function* () {
    const foundShop = yield findByEmail({ email });
    if (!foundShop)
        throw new BadRequestRequestError("Shop has not been registered yet.");
    const match = bcrypt.compare(password, foundShop.password);
    if (!match)
        throw new UnauthorizedRequestError("Incorrect password.");
    // Create token pairs
    const { publicKey, privateKey } = yield generateTokenPairs();
    const { _id: userId } = foundShop;
    const payload = { userId, email };
    const tokens = yield createTokenPair(payload, publicKey, privateKey);
    // Create new refreshToken and save used refreshToken for verifying.
    yield KeyTokenService.createKeyToken({
        userId,
        refreshToken: tokens.refreshToken,
        privateKey,
        publicKey,
    });
    return {
        shop: getInfoData({
            fields: ["_id", "name", "email"],
            object: foundShop,
        }),
        tokens,
    };
});
AccessService.logout = (keyStore) => __awaiter(void 0, void 0, void 0, function* () {
    return yield KeyTokenService.removeKeyById(keyStore._id);
});
AccessService.refreshToken = ({ refreshToken, user, keyStore }) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, email } = user;
    // Check if this refresh token is in used token list, then delete token and re-login
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
        yield KeyTokenService.deleteKeyById(userId);
        throw new ForbiddenRequestError("Token is invalid. Please re-login!!");
    }
    // Check if token exist in database
    if (keyStore.refreshToken !== refreshToken)
        throw new UnauthorizedRequestError("Shop has not been registered yet.");
    const foundShop = yield findByEmail({ email });
    if (!foundShop)
        throw new UnauthorizedRequestError("Shop has not been registered yet.");
    // Accept to access and return new token pair
    const newPairToken = yield createTokenPair({ userId, email }, keyStore.publicKey, keyStore.privateKey);
    yield keyStore.updateOne({
        $set: {
            refreshToken: newPairToken.refreshToken,
        },
        $addToSet: {
            refreshTokensUsed: refreshToken,
        },
    });
    return {
        user,
        tokens: newPairToken,
    };
});
module.exports = AccessService;
