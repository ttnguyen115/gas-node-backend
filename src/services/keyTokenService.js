"use strict";

const keyTokenModel = require("../models/keyTokenModel");

class KeyTokenService {
  static createKeyToken = async ({ userId, publicKey }) => {
    try {
      const tokens = await keyTokenModel.create({
        user: userId,
        publicKey: publicKey.toString(),
      });
      return tokens ? tokens.publicKey : null;
    } catch (e) {
      return e;
    }
  };
}

module.exports = KeyTokenService;
