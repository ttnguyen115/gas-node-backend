"use strict";

const { findById } = require("../services/apiKeyService");
const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");
const { HEADER } = require("./HeaderConstant");

async function apiKey(req, res, next) {
  const key = req.headers[HEADER.API_KEY]?.toString();
  if (!key)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: ReasonPhrases.FORBIDDEN });

  const keyObj = await findById(key);
  if (!keyObj)
    return res
      .status(StatusCodes.FORBIDDEN)
      .json({ message: ReasonPhrases.FORBIDDEN });

  req.objKey = keyObj;
  return next();
}

function permission(permissionCode) {
  return (req, res, next) => {
    if (!req.objKey.permissions)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Permissions denied." });
    const validPermission = req.objKey.permissions.includes(permissionCode);
    if (!validPermission)
      return res
        .status(StatusCodes.FORBIDDEN)
        .json({ message: "Permissions denied." });

    return next();
  };
}

module.exports = {
  apiKey,
  permission,
};
