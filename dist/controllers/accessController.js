"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const AccessService = require("../services/accessService");
const { Ok, Created } = require("../core/successResponse");
class AccessController {
    constructor() {
        this.signUp = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const accessServiceResponse = yield AccessService.signUp(req.body);
            new Created({
                message: "Registered successfully!",
                metadata: accessServiceResponse,
                options: {
                    server_health: "Ok",
                },
            }).send(res);
        });
        this.login = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const accessServiceResponse = yield AccessService.login(req.body);
            new Ok({
                message: "Login successfully!",
                metadata: accessServiceResponse,
                options: {
                    server_health: "Ok",
                },
            }).send(res);
        });
        this.logout = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const accessServiceResponse = yield AccessService.logout(req.keyStore);
            new Ok({
                message: "Logout successfully!",
                metadata: accessServiceResponse,
            }).send(res);
        });
        this.refreshToken = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const { refreshToken, user, keyStore } = req;
            const accessServiceResponse = yield AccessService.refreshToken({
                refreshToken,
                user,
                keyStore,
            });
            new Ok({
                message: "Welcome back!",
                metadata: accessServiceResponse,
            }).send(res);
        });
    }
}
module.exports = new AccessController();
