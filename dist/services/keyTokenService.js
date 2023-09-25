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
const keyTokenModel = require("../models/keyTokenModel");
const { Types } = require("mongoose");
class KeyTokenService {
}
_a = KeyTokenService;
KeyTokenService.createKeyToken = ({ userId, publicKey, privateKey, refreshToken, }) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Basic usage
        // const tokens = await keyTokenModel.create({
        //   user: userId,
        //   publicKey,
        //   privateKey,
        // });
        // Advanced usage
        const filter = { user: userId };
        const update = {
            publicKey,
            privateKey,
            refreshTokensUsed: [],
            refreshToken,
        };
        const options = { upsert: true, new: true };
        const tokens = yield keyTokenModel.findOneAndUpdate(filter, update, options);
        return tokens ? tokens.publicKey : null;
    }
    catch (e) {
        return e;
    }
});
KeyTokenService.findByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return keyTokenModel.findOne({ user: new Types.ObjectId(userId) });
});
KeyTokenService.removeKeyById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return keyTokenModel.deleteOne(id);
});
KeyTokenService.findByRefreshTokenUsed = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
});
KeyTokenService.findByRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    return keyTokenModel.findOne({ refreshToken });
});
KeyTokenService.deleteKeyById = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return keyTokenModel.deleteOne({
        user: new Types.ObjectId(userId),
    });
});
module.exports = KeyTokenService;
