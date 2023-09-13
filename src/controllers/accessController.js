"use strict";

const AccessService = require("../services/accessService");

class AccessController {
  signUp = async (req, res, next) => {
    const accessServiceResponse = await AccessService.signUp(req.body);
    return res.status(201).json(accessServiceResponse);
  };
}

module.exports = new AccessController();
