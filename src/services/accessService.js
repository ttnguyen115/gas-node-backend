"use strict";

const bcrypt = require("bcrypt");
const crypto = import("node:crypto");

const KeyTokenService = require("../services/keyTokenService");
const shopModel = require("../models/shopModel");
const { createTokenPair } = require("../auth/authUtils");

const RoleShop = {
  SHOP: "0001",
  WRITER: "0002",
  EDITOR: "0003",
  ADMIN: "0000",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    try {
      const holderShop = await shopModel.findOne({ email }).lean();

      if (holderShop) {
        return {
          code: "xxx",
          message: "Shop already registered!",
        };
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const newShop = await shopModel.create({
        name,
        email,
        password: hashPassword,
        roles: [RoleShop.SHOP],
      });

      if (newShop) {
        const cryptoKeyPairOpts = {
          modulusLength: 4096,
          publicKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
          privateKeyEncoding: {
            type: "pkcs1",
            format: "pem",
          },
        };
        const { publicKey, privateKey } = (await crypto).generateKeyPairSync(
          "rsa",
          cryptoKeyPairOpts,
        );
        console.log("{ privateKey, publicKey }::", { privateKey, publicKey });
        const publicKeyString = await KeyTokenService.createKeyToken({
          userId: newShop._id,
          publicKey,
        });
        console.log(`publicKeyString::${publicKeyString}`);
        if (!publicKeyString) {
          return {
            code: "xxx",
            message: "publicKeyString error!",
          };
        }

        const publicKeyObj = (await crypto).createPublicKey(publicKeyString);
        const payload = { userId: newShop._id, email };
        const tokens = await createTokenPair(payload, publicKeyObj, privateKey);
        console.log("Created token successfully!::", tokens);

        return {
          code: 201,
          metadata: {
            shop: newShop,
            tokens,
          },
        };
      }

      return {
        code: 200,
        metadata: null,
      };
    } catch (e) {
      return {
        code: "xxx",
        message: e.message,
        status: "error",
      };
    }
  };
}

module.exports = AccessService;
