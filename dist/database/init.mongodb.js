"use strict";
const mongoose = require("mongoose");
const { countConnect, checkOverload } = require("../helpers/checkConnection");
const { db: { username, password, host } } = require("../configs/configMongodb");
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
    connect(dbType = 'mongodb') {
        mongoose.set('debug', true);
        mongoose.set('debug', { color: true });
        mongoose.connect(connectionMongoUrl)
            .then(_ => {
            console.log(`Connected Mongodb success::${connectionMongoUrl}`);
            // countConnect()
            // checkOverload()
        })
            .catch(err => console.log(`Error connection to MongoDB::${connectionMongoUrl}`));
    }
}
const instanceMongodb = Database.getInstance();
module.exports = instanceMongodb;
