"use strict";

const bcrypt = require("bcrypt");
const crypto = require("node:crypto");

const KeyTokenService = require("../services/keyTokenService");
const { findByEmail } = require("../services/shopService");
const shopModel = require("../models/shopModel");
const { createTokenPair } = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestRequestError,
  InternalServerRequestError,
} = require("../core/errorResponse");

const RoleShop = {
  SHOP: "0001",
  WRITER: "0002",
  EDITOR: "0003",
  ADMIN: "0000",
};

class AccessService {
  static signUp = async ({ name, email, password }) => {
    // Check if shop exists
    const holderShop = await shopModel.findOne({ email }).lean();
    if (holderShop) {
      throw new BadRequestRequestError("Shop already registered");
    }

    // Encrypt password & create new object in shop model
    const hashPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashPassword,
      roles: [RoleShop.SHOP],
    });
    if (!newShop) return { code: 200, metadata: null };

    // Create rsa key-pair for each shop instance
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
    // Create publicKeyString for new shop based on publicKey from rsa
    const publicKeyString = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
    });
    if (!publicKeyString) {
      throw new InternalServerRequestError(
        "Generating public key string error!",
      );
    }
    // Create public and secret keys for authentication based on publicKeyString
    const publicKeyObj = (await crypto).createPublicKey(publicKeyString);
    const payload = { userId: newShop._id, email };
    const tokens = await createTokenPair(payload, publicKeyObj, privateKey);

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
  };

  static login = async ({ email, password, refreshToken = null }) => {
    const foundShop = findByEmail({ email });
    if (!foundShop)
      throw new BadRequestRequestError("Shop has not been registered yet.");

    const match = bcrypt.compare(password, foundShop.password);
  };
}

module.exports = AccessService;
