"use strict";

const AccessService = require("../services/accessService");
const { Ok, Created } = require("../core/successResponse");

class AccessController {
  signUp = async (req, res, next) => {
    const accessServiceResponse = await AccessService.signUp(req.body);
    new Created({
      message: "Registered successfully!",
      metadata: accessServiceResponse,
      options: {
        server_health: "Ok",
      },
    }).send(res);
  };

  login = async (req, res, next) => {
    const accessServiceResponse = await AccessService.login(req.body);
    new Ok({
      message: "Login successfully!",
      metadata: accessServiceResponse,
      options: {
        server_health: "Ok",
      },
    }).send(res);
  };
}

module.exports = new AccessController();
