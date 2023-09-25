"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.furniture = exports.clothing = exports.electronic = exports.product = void 0;
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const DOCUMENT_NAME = "Product";
const COLLECTION_NAME = "Products";
const productSchema = new mongoose_1.Schema({
    product_name: {
        type: String,
        required: true,
    },
    product_thumb: {
        type: String,
        required: true,
    },
    product_description: String,
    product_slug: String,
    product_price: {
        type: Number,
        required: true,
    },
    product_quantity: {
        type: Number,
        required: true,
    },
    product_type: {
        type: String,
        required: true,
        enum: ["Electronics", "Clothing", "Furniture"],
    },
    product_shop: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop" },
    product_attributes: {
        type: mongoose_1.Schema.Types.Mixed,
        required: true,
    },
    product_ratings: {
        type: Number,
        default: 4.5,
        min: [1, "Rating must be above 1.0"],
        max: [5, "Rating must be below 5.0"],
        set: (val) => Math.round(val * 10) / 10,
    },
    product_variants: {
        type: [String],
        default: [],
    },
    isDraft: {
        type: Boolean,
        default: true,
        index: true,
        select: false,
    },
    isPublished: {
        type: Boolean,
        default: false,
        index: true,
        select: false,
    },
}, {
    collection: COLLECTION_NAME,
    timestamps: true,
});
// Create index for searching
productSchema.index({ product_name: "text", product_description: "text" });
// Model middleware
productSchema.pre("save", function (next) {
    this.product_slug = (0, slugify_1.default)(this.product_name, { lower: true });
    next();
});
const electronicSchema = new mongoose_1.Schema({
    manufacturer: {
        type: String,
        required: true,
    },
    model: String,
    color: String,
    product_shop: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop" },
}, {
    collection: "Electronics",
    timestamps: true,
});
const clothingSchema = new mongoose_1.Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
    product_shop: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop" },
}, {
    collection: "Clothing",
    timestamps: true,
});
const furnitureSchema = new mongoose_1.Schema({
    brand: {
        type: String,
        required: true,
    },
    size: String,
    material: String,
    product_shop: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shop" },
}, {
    collection: "Furniture",
    timestamps: true,
});
exports.product = (0, mongoose_1.model)(DOCUMENT_NAME, productSchema);
exports.electronic = (0, mongoose_1.model)("Electronics", electronicSchema);
exports.clothing = (0, mongoose_1.model)("Clothing", clothingSchema);
exports.furniture = (0, mongoose_1.model)("Furniture", furnitureSchema);
