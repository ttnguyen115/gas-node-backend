"use strict";

const JWT = require("jsonwebtoken");

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
  return {
    expiresIn: days,
  };
};

module.exports = {
  createTokenPair,
};
