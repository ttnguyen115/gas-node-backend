"use strict";

const JWT = require("jsonwebtoken");
const crypto = require("node:crypto");

const createTokenPair = async (payload, publicKey, privateKey) => {
  try {
    const accessToken = await JWT.sign(
      payload,
      publicKey,
      generateJwtSignOpts("2 days"),
    );
    const refreshToken = await JWT.sign(
      payload,
      privateKey,
      generateJwtSignOpts("7 days"),
    );
    JWT.verify(accessToken, publicKey, (error, decode) => {
      if (error) {
        console.log("AccessToken verify error::", error);
      } else {
        console.log("Decode accessToken verify error::", decode);
      }
    });
    return { accessToken, refreshToken };
  } catch (e) {
    return e;
  }
};

const generateJwtSignOpts = (days) => {
  return { expiresIn: days };
};

const generateTokenPairs = async () => {
  return {
    privateKey: (await crypto).randomBytes(64).toString("hex"),
    publicKey: (await crypto).randomBytes(64).toString("hex"),
  };
};

module.exports = {
  createTokenPair,
  generateTokenPairs,
};
