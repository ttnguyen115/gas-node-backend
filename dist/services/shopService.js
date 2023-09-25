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
const shopModel = require("../models/shopModel");
function findByEmail({ email, select = { email: 1, password: 2, name: 1, status: 1, roles: 1 }, }) {
    return __awaiter(this, void 0, void 0, function* () {
        return shopModel.findOne({ email }).select(select).lean();
    });
}
module.exports = {
    findByEmail,
};
