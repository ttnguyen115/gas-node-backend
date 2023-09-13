"use strict";

const { findById } = require("../services/apiKeyService");
const { ReasonStatusCode, StatusCode } = require("../core/errorResponse");

const HEADER = {
  API_KEY: "x-api-key",
  AUTHORIZATION: "authorization",
};

async function apiKey(req, res, next) {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key)
    return res
      .status(StatusCode.FORBIDDEN)
      .json({ message: ReasonStatusCode.FORBIDDEN });

  const keyObj = await findById(key);
  if (!keyObj)
    return res
      .status(StatusCode.FORBIDDEN)
      .json({ message: ReasonStatusCode.FORBIDDEN });

  req.objKey = keyObj;
  return next();
}

function permission(permissionCode) {
  return (req, res, next) => {
    if (req.objKey.permissions)
      return res
        .status(StatusCode.PERMISSION)
        .json({ message: ReasonStatusCode.PERMISSION });

    const validPermission = req.objKey.permissions.includes(permissionCode);
    if (!validPermission)
      return res
        .status(StatusCode.PERMISSION)
        .json({ message: ReasonStatusCode.PERMISSION });

    return next();
  };
}

function asyncHandler(callback) {
  return (req, res, next) => {
    callback(req, res, next).catch(next);
  };
}

module.exports = {
  apiKey,
  permission,
  asyncHandler,
};
