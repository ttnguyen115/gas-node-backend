import JWT from "jsonwebtoken";
import crypto from "node:crypto";
import { asyncHandler } from "../helpers/asyncHandler";
import { findByUserId } from "../services/keyTokenService";
import { HEADER } from "./HeaderConstant";
import {
  NotFoundRequestError,
  UnauthorizedRequestError,
} from "../core/errorResponse";

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

/*
 * This function is used for validating request.
 */
const authentication = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  if (!userId) throw new UnauthorizedRequestError("User ID is missing.");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundRequestError("KeyStore not found.");

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken)
    throw new UnauthorizedRequestError("Access token is missing.");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new UnauthorizedRequestError("User ID is invalid");
    req.keyStore = keyStore;
    return next();
  } catch (error) {
    throw error;
  }
});

const authenticationV2 = asyncHandler(async (req, res, next) => {
  const userId = req.headers[HEADER.CLIENT_ID]?.toString();
  if (!userId) throw new UnauthorizedRequestError("User ID is missing.");

  const keyStore = await findByUserId(userId);
  if (!keyStore) throw new NotFoundRequestError("KeyStore not found.");

  if (req.headers[HEADER.REFRESHTOKEN]) {
    const refreshToken = req.headers[HEADER.REFRESHTOKEN];
    try {
      const decodeUser = JWT.verify(refreshToken, keyStore.privateKey);
      if (userId !== decodeUser.userId)
        throw new UnauthorizedRequestError("User ID is invalid");
      req.keyStore = keyStore;
      req.user = decodeUser;
      req.refreshToken = refreshToken;
      return next();
    } catch (error) {
      throw error;
    }
  }

  const accessToken = req.headers[HEADER.AUTHORIZATION]?.toString();
  if (!accessToken)
    throw new UnauthorizedRequestError("Access token is missing.");

  try {
    const decodeUser = JWT.verify(accessToken, keyStore.publicKey);
    if (userId !== decodeUser.userId)
      throw new UnauthorizedRequestError("User ID is invalid");
    req.keyStore = keyStore;
    req.user = decodeUser;
    return next();
  } catch (error) {
    throw error;
  }
});

const verifyJwt = async (token, keySecret) => {
  return JWT.verify(token, keySecret);
};

export {
  createTokenPair,
  generateTokenPairs,
  authentication,
  authenticationV2,
  verifyJwt,
};
