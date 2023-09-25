"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// import {countConnect, checkOverload} from "../helpers/checkConnection";
const configMongodb_1 = __importDefault(require("../configs/configMongodb"));
const { db: { username, password, host }, } = configMongodb_1.default;
const connectionMongoUrl = `mongodb+srv://${username}:${password}@${host}`;
class Database {
    constructor() {
        this.connect();
    }
    static getInstance() {
        if (!Database.instance) {
            Database.instance = new Database();
        }
        return Database.instance;
    }
    connect(dbType = "mongodb") {
        mongoose_1.default.set("debug", true);
        mongoose_1.default.set("debug", { color: true });
        mongoose_1.default
            .connect(connectionMongoUrl)
            .then((_) => {
            console.log(`Connected Mongodb success::${connectionMongoUrl}`);
            // countConnect()
            // checkOverload()
        })
            .catch((err) => console.log(`Error connection to MongoDB::${connectionMongoUrl}`));
    }
}
const instanceMongodb = Database.getInstance();
exports.default = instanceMongodb;
