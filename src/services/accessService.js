"use strict";

const bcrypt = require("bcrypt");
const KeyTokenService = require("../services/keyTokenService");
const { findByEmail } = require("../services/shopService");
const shopModel = require("../models/shopModel");
const {
  createTokenPair,
  generateTokenPairs,
  verifyJwt,
} = require("../auth/authUtils");
const { getInfoData } = require("../utils");
const {
  BadRequestRequestError,
  InternalServerRequestError,
  UnauthorizedRequestError,
  ForbiddenRequestError,
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

    // Create key-pair for each shop instance
    const { publicKey, privateKey } = await generateTokenPairs();
    // Create publicKeyString for new shop based on publicKey from rsa
    const keyStore = await KeyTokenService.createKeyToken({
      userId: newShop._id,
      publicKey,
      privateKey,
    });
    if (!keyStore)
      throw new InternalServerRequestError("Generating keyStore error!");

    // Create token pairs
    const payload = { userId: newShop._id, email };
    const tokens = await createTokenPair(payload, publicKey, privateKey);

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
    const foundShop = await findByEmail({ email });
    if (!foundShop)
      throw new BadRequestRequestError("Shop has not been registered yet.");

    const match = bcrypt.compare(password, foundShop.password);
    if (!match) throw new UnauthorizedRequestError("Incorrect password.");

    // Create token pairs
    const { publicKey, privateKey } = await generateTokenPairs();
    const { _id: userId } = foundShop;
    const payload = { userId, email };
    const tokens = await createTokenPair(payload, publicKey, privateKey);

    // Create new refreshToken and save used refreshToken for verifying.
    await KeyTokenService.createKeyToken({
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
  };

  static logout = async (keyStore) => {
    return await KeyTokenService.removeKeyById(keyStore._id);
  };

  static refreshToken = async (refreshToken) => {
    // Check if this refresh token is in used token list, then delete token and re-login
    const foundToken =
      await KeyTokenService.findByRefreshTokenUsed(refreshToken);
    if (foundToken) {
      const { userId } = await verifyJwt(refreshToken, foundToken.privateKey);
      await KeyTokenService.deleteKeyById(userId);
      throw new ForbiddenRequestError("Token is invalid. Please re-login!!");
    }

    // Check if token exist in database
    const holderToken = await KeyTokenService.findByRefreshToken(refreshToken);
    if (!holderToken)
      throw new UnauthorizedRequestError("Shop has not been registered yet.");
    // Check if token is connected with any shop
    const { userId, email } = await verifyJwt(
      refreshToken,
      holderToken.privateKey,
    );
    const foundShop = await findByEmail({ email });
    if (!foundShop)
      throw new UnauthorizedRequestError("Shop has not been registered yet.");

    // Accept to access and return new token pair
    const newPairToken = await createTokenPair(
      { userId, email },
      holderToken.publicKey,
      holderToken.privateKey,
    );
    await holderToken.updateOne({
      $set: {
        refreshToken: newPairToken.refreshToken,
      },
      $addToSet: {
        refreshTokensUsed: refreshToken,
      },
    });

    return {
      user: { userId, email },
      tokens: newPairToken,
    };
  };
}

module.exports = AccessService;
