"use strict";

const keyTokenModel = require("../models/keyTokenModel");
const { Types } = require("mongoose");

class KeyTokenService {
  static createKeyToken = async ({
    userId,
    publicKey,
    privateKey,
    refreshToken,
  }) => {
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
      const tokens = await keyTokenModel.findOneAndUpdate(
        filter,
        update,
        options,
      );

      return tokens ? tokens.publicKey : null;
    } catch (e) {
      return e;
    }
  };

  static findByUserId = async (userId) => {
    return keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
  };

  static removeKeyById = async (id) => {
    return keyTokenModel.deleteOne(id);
  };

  static findByRefreshTokenUsed = async (refreshToken) => {
    return keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
  };

  static findByRefreshToken = async (refreshToken) => {
    return keyTokenModel.findOne({ refreshToken });
  };

  static deleteKeyById = async (userId) => {
    return keyTokenModel.deleteOne({
      user: new Types.ObjectId(userId),
    });
  };
}

module.exports = KeyTokenService;
