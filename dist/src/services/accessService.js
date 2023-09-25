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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt_1 = __importDefault(require("bcrypt"));
const keyTokenService_1 = __importDefault(require("./keyTokenService"));
const shopService_1 = require("./shopService");
const shopModel_1 = __importDefault(require("../models/shopModel"));
const authUtils_1 = require("../auth/authUtils");
const utils_1 = require("../utils");
const errorResponse_1 = require("../core/errorResponse");
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
    const holderShop = yield shopModel_1.default.findOne({ email }).lean();
    if (holderShop) {
        throw new errorResponse_1.BadRequestRequestError("Shop already registered");
    }
    // Encrypt password & create new object in shop model
    const hashPassword = yield bcrypt_1.default.hash(password, 10);
    const newShop = yield shopModel_1.default.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
    });
    if (!newShop)
        return { code: 200, metadata: null };
    // Create key-pair for each shop instance
    const { publicKey, privateKey } = yield (0, authUtils_1.generateTokenPairs)();
    // Create publicKeyString for new shop based on publicKey from rsa
    const keyStore = yield keyTokenService_1.default.createKeyToken({
        userId: newShop._id,
        publicKey,
        privateKey,
    });
    if (!keyStore)
        throw new errorResponse_1.InternalServerRequestError("Generating keyStore error!");
    // Create token pairs
    const payload = { userId: newShop._id, email };
    const tokens = yield (0, authUtils_1.createTokenPair)(payload, publicKey, privateKey);
    return {
        code: 201,
        metadata: {
            shop: (0, utils_1.getInfoData)({
                fields: ["_id", "name", "email"],
                object: newShop,
            }),
            tokens,
        },
    };
});
AccessService.login = ({ email, password, refreshToken = null }) => __awaiter(void 0, void 0, void 0, function* () {
    const foundShop = yield (0, shopService_1.findByEmail)({ email });
    if (!foundShop)
        throw new errorResponse_1.BadRequestRequestError("Shop has not been registered yet.");
    const match = bcrypt_1.default.compare(password, foundShop.password);
    if (!match)
        throw new errorResponse_1.UnauthorizedRequestError("Incorrect password.");
    // Create token pairs
    const { publicKey, privateKey } = yield (0, authUtils_1.generateTokenPairs)();
    const { _id: userId } = foundShop;
    const payload = { userId, email };
    const tokens = yield (0, authUtils_1.createTokenPair)(payload, publicKey, privateKey);
    // Create new refreshToken and save used refreshToken for verifying.
    yield keyTokenService_1.default.createKeyToken({
        userId,
        refreshToken: tokens.refreshToken,
        privateKey,
        publicKey,
    });
    return {
        shop: (0, utils_1.getInfoData)({
            fields: ["_id", "name", "email"],
            object: foundShop,
        }),
        tokens,
    };
});
AccessService.logout = (keyStore) => __awaiter(void 0, void 0, void 0, function* () {
    return yield keyTokenService_1.default.removeKeyById(keyStore._id);
});
AccessService.refreshToken = ({ refreshToken, user, keyStore }) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, email } = user;
    // Check if this refresh token is in used token list, then delete token and re-login
    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
        yield keyTokenService_1.default.deleteKeyById(userId);
        throw new errorResponse_1.ForbiddenRequestError("Token is invalid. Please re-login!!");
    }
    // Check if token exist in database
    if (keyStore.refreshToken !== refreshToken)
        throw new errorResponse_1.UnauthorizedRequestError("Shop has not been registered yet.");
    const foundShop = yield (0, shopService_1.findByEmail)({ email });
    if (!foundShop)
        throw new errorResponse_1.UnauthorizedRequestError("Shop has not been registered yet.");
    // Accept to access and return new token pair
    const newPairToken = yield (0, authUtils_1.createTokenPair)({ userId, email }, keyStore.publicKey, keyStore.privateKey);
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
exports.default = AccessService;
