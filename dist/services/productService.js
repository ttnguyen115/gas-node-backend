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
const { product, clothing, electronic, furniture, } = require("../models/productModel");
const { BadRequestRequestError } = require("../core/errorResponse");
const ProductRepository = require("../repositories/productRepository");
const InventoryRepository = require("../repositories/inventoryRepository");
const { removeNullObject, updateNestedObjectParser } = require("../utils");
class ProductFactory {
    static registerProductType(type, classRef) {
        ProductFactory.productRegistry[type] = classRef;
    }
    static findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { product_shop, isDraft: true };
            return yield ProductRepository.findAllDraftsForShop({ query, limit, skip });
        });
    }
    static findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { product_shop, isPublished: true };
            return yield ProductRepository.findAllPublishForShop({
                query,
                limit,
                skip,
            });
        });
    }
    static searchProducts({ keySearch }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository.searchProductByUser({ keySearch });
        });
    }
    static findAllProducts({ limit = 50, sort = "ctime", page = 1, filter = { isPublished: true }, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository.findAllProducts({
                limit,
                sort,
                page,
                filter,
                select: ["product_name", "product_price", "product_thumb"],
            });
        });
    }
    static findProduct({ product_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository.findProduct({
                product_id,
                unSelect: ["__v"],
            });
        });
    }
    static createProduct(type, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const productClass = ProductFactory.productRegistry[type];
            if (!productClass)
                throw new BadRequestRequestError(`Invalid product type ${type}.`);
            return new productClass(payload).createProduct();
        });
    }
    static updateProduct(type, product_id, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const productClass = ProductFactory.productRegistry[type];
            if (!productClass)
                throw new BadRequestRequestError(`Invalid product type ${type}.`);
            return new productClass(payload).updateProduct(product_id);
        });
    }
    static publishProductByShop({ product_shop, product_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository.publishProductByShop({
                product_shop,
                product_id,
            });
        });
    }
    static unPublishProductByShop({ product_shop, product_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository.unPublishProductByShop({
                product_shop,
                product_id,
            });
        });
    }
}
ProductFactory.productRegistry = {};
class Product {
    constructor({ product_name, product_thumb, product_description, product_price, product_quantity, product_type, product_shop, product_attributes, }) {
        this.product_name = product_name;
        this.product_thumb = product_thumb;
        this.product_description = product_description;
        this.product_price = product_price;
        this.product_quantity = product_quantity;
        this.product_type = product_type;
        this.product_shop = product_shop;
        this.product_attributes = product_attributes;
    }
    createProduct(product_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newProduct = yield product.create(Object.assign(Object.assign({}, this), { _id: product_id }));
            if (newProduct) {
                yield InventoryRepository.insertInventory({
                    productId: newProduct._id,
                    shopId: this.product_shop,
                    stock: this.product_quantity,
                });
            }
            return newProduct;
        });
    }
    updateProduct(product_id, bodyUpdate) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield ProductRepository.updateProductById({
                product_id,
                bodyUpdate,
                productType: product,
            });
        });
    }
}
class Clothing extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newClothing = yield clothing.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newClothing)
                throw new BadRequestRequestError("Create Clothing attributes failed.");
            const newProduct = yield _super.createProduct.call(this, newClothing._id);
            if (!newProduct)
                throw new BadRequestRequestError("Create Clothing product failed.");
            return newProduct;
        });
    }
    updateProduct(product_id) {
        const _super = Object.create(null, {
            updateProduct: { get: () => super.updateProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const objectParams = removeNullObject(this);
            if (objectParams.product_attributes) {
                yield ProductRepository.updateProductById({
                    product_id,
                    bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                    productType: clothing,
                });
            }
            return yield _super.updateProduct.call(this, product_id, updateNestedObjectParser(objectParams));
        });
    }
}
class Electronics extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newElectronic = yield electronic.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newElectronic)
                throw new BadRequestRequestError("Create Electronic attributes failed.");
            const newProduct = yield _super.createProduct.call(this, newElectronic._id);
            if (!newProduct)
                throw new BadRequestRequestError("Create Electronic product failed.");
            return newProduct;
        });
    }
    updateProduct(product_id) {
        const _super = Object.create(null, {
            updateProduct: { get: () => super.updateProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const objectParams = removeNullObject(this);
            if (objectParams.product_attributes) {
                yield ProductRepository.updateProductById({
                    product_id,
                    bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                    productType: electronic,
                });
            }
            return yield _super.updateProduct.call(this, product_id, updateNestedObjectParser(objectParams));
        });
    }
}
class Furniture extends Product {
    createProduct() {
        const _super = Object.create(null, {
            createProduct: { get: () => super.createProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const newFurniture = yield furniture.create(Object.assign(Object.assign({}, this.product_attributes), { product_shop: this.product_shop }));
            if (!newFurniture)
                throw new BadRequestRequestError("Create Furniture attributes failed.");
            const newProduct = yield _super.createProduct.call(this, newFurniture._id);
            if (!newProduct)
                throw new BadRequestRequestError("Create Furniture product failed.");
            return newProduct;
        });
    }
    updateProduct(product_id) {
        const _super = Object.create(null, {
            updateProduct: { get: () => super.updateProduct }
        });
        return __awaiter(this, void 0, void 0, function* () {
            const objectParams = removeNullObject(this);
            if (objectParams.product_attributes) {
                yield ProductRepository.updateProductById({
                    product_id,
                    bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
                    productType: furniture,
                });
            }
            return yield _super.updateProduct.call(this, product_id, updateNestedObjectParser(objectParams));
        });
    }
}
const ProductTypes = {
    Electronics: Electronics,
    Clothing: Clothing,
    Furniture: Furniture,
};
for (const [type, classRef] of Object.entries(ProductTypes)) {
    ProductFactory.registerProductType(type, classRef);
}
module.exports = ProductFactory;
