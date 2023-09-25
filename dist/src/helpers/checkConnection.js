"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkOverload = exports.countConnect = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const os_1 = __importDefault(require("os"));
const process_1 = __importDefault(require("process"));
const _SECONDS = 5000; // 5 seconds
const countConnect = () => {
    const numConnection = mongoose_1.default.connections.length;
    console.log(`Number of connections: ${numConnection}`);
};
exports.countConnect = countConnect;
const checkOverload = () => {
    setInterval(() => {
        const numConnection = mongoose_1.default.connections.length;
        const numCores = os_1.default.cpus().length;
        const memoryUsage = process_1.default.memoryUsage().rss;
        const maxConnections = numCores * 5;
        console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);
        console.log(`Active connections:: ${numConnection}`);
        if (numConnection > maxConnections) {
            console.log("Connection overload detected!");
        }
    }, _SECONDS);
};
exports.checkOverload = checkOverload;
