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
const ProductService = require("../services/productService");
const { Ok, Created } = require("../core/successResponse");
class ProductController {
    constructor() {
        /**
         * @desc Create new product
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.createProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Created({
                message: "Created new product successfully!",
                metadata: yield ProductService.createProduct(req.body.product_type, Object.assign(Object.assign({}, req.body), { product_shop: req.user.userId })),
            }).send(res);
        });
        /**
         * @desc Patch to update product by id
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.updateProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Created({
                message: "Update product detail successfully!",
                metadata: yield ProductService.updateProduct(req.body.product_type, req.params.product_id, Object.assign(Object.assign({}, req.body), { product_shop: req.user.userId })),
            }).send(res);
        });
        /**
         * @desc Change publish product status by shop
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.publishProductForShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Created({
                message: "Published product successfully!",
                metadata: yield ProductService.publishProductByShop({
                    product_id: req.params.id,
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        /**
         * @desc Change publish product status by shop
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.unPublishProductByShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Created({
                message: "Unpublished product successfully!",
                metadata: yield ProductService.unPublishProductByShop({
                    product_id: req.params.id,
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        /**
         * @desc Get all drafts for shop
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.getAllDraftsForShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Ok({
                message: "Get all drafts for shop successfully!",
                metadata: yield ProductService.findAllDraftsForShop({
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        /**
         * @desc Get all published products for shop
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.getAllPublishForShop = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Ok({
                message: "Get all drafts for shop successfully!",
                metadata: yield ProductService.findAllPublishForShop({
                    product_shop: req.user.userId,
                }),
            }).send(res);
        });
        /**
         * @desc Get all published products for user
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.getSearchProductsForUser = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Ok({
                message: "Get search products successfully!",
                metadata: yield ProductService.searchProducts(req.params),
            }).send(res);
        });
        /**
         * @desc Get all products
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.findAllProducts = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Ok({
                message: "Get all products successfully!",
                metadata: yield ProductService.findAllProducts(req.query),
            }).send(res);
        });
        /**
         * @desc Get product detail
         * @param req
         * @param res
         * @param next
         * @returns {Promise<void>}
         */
        this.findProduct = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            new Ok({
                message: "Get product detail successfully!",
                metadata: yield ProductService.findProduct({
                    product_id: req.params.product_id,
                }),
            }).send(res);
        });
    }
}
module.exports = new ProductController();
