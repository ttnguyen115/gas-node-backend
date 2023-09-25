"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./src/app"));
const PORT = process.env.PORT || 3056;
const server = app_1.default.listen(PORT, () => {
    console.log(`WSV eCommerce starts with port: ${PORT}`);
});
// SIGINT => on type Ctrl + C in IDE
process.on("SIGINT", () => {
    server.close(() => console.log("Exit server express"));
});
