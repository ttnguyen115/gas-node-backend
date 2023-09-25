"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dev = {
    app: {
        port: process.env.DEV_APP_PORT || 3056,
    },
    db: {
        host: process.env.DEV_DB_HOST,
        port: process.env.DEV_DB_PORT || 27017,
        name: process.env.DEV_DB_NAME || "dbDev",
        username: process.env.DEV_MONGODB_USERNAME,
        password: process.env.DEV_MONGODB_PASSWORD,
    },
};
const prod = {
    app: {
        port: process.env.PROD_APP_PORT || 3030,
    },
    db: {
        host: process.env.PROD_DB_HOST,
        port: process.env.PROD_DB_PORT || 27017,
        name: process.env.PROD_DB_NAME || "dbProd",
        username: process.env.PROD_MONGODB_USERNAME,
        password: process.env.PROD_MONGODB_PASSWORD,
    },
};
const config = { dev, prod };
const env = process.env.NODE_ENV || "dev";
// @ts-ignore
exports.default = config[env];
