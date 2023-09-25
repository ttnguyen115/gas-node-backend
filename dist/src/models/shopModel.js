"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DOCUMENT_NAME = "Shop";
const COLLECTION_NAME = "Shops";
const shopSchema = new mongoose_1.Schema({
    name: {
        type: String,
        trim: true,
        maxLength: 150,
    },
    email: {
        type: String,
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "inactive",
    },
    verify: {
        type: mongoose_1.Schema.Types.Boolean,
        default: false,
    },
    roles: {
        type: [String],
        default: [],
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
exports.default = (0, mongoose_1.model)(DOCUMENT_NAME, shopSchema);
