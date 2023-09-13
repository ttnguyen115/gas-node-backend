"use strict";

const keyTokenModel = require("../models/keyTokenModel");

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
}

module.exports = KeyTokenService;
