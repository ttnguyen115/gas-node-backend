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

  logout = async (req, res, next) => {
    const accessServiceResponse = await AccessService.logout(req.keyStore);
    new Ok({
      message: "Logout successfully!",
      metadata: accessServiceResponse,
    }).send(res);
  };

  refreshToken = async (req, res, next) => {
    const { refreshToken, user, keyStore } = req;
    const accessServiceResponse = await AccessService.refreshToken({
      refreshToken,
      user,
      keyStore,
    });
    new Ok({
      message: "Welcome back!",
      metadata: accessServiceResponse,
    }).send(res);
  };
}

module.exports = new AccessController();
