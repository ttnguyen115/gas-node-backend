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
const { product } = require("../models/productModel");
const { Types } = require("mongoose");
const { getSelectData, getUnselectData } = require("../utils");
class ProductRepository {
    // For Shop
    static findAllDraftsForShop({ query, limit, skip }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queryProducts({ query, limit, skip });
        });
    }
    static findAllPublishForShop({ query, limit, skip }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.queryProducts({ query, limit, skip });
        });
    }
    static publishProductByShop({ product_shop, product_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundShop = yield this.queryOneProduct({ product_shop, product_id });
            if (!foundShop)
                return null;
            foundShop.isDraft = false;
            foundShop.isPublished = true;
            const { modifiedCount } = yield foundShop.updateOne(foundShop);
            return modifiedCount;
        });
    }
    static unPublishProductByShop({ product_shop, product_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundShop = yield this.queryOneProduct({ product_shop, product_id });
            if (!foundShop)
                return null;
            foundShop.isDraft = true;
            foundShop.isPublished = false;
            const { modifiedCount } = yield foundShop.updateOne(foundShop);
            return modifiedCount;
        });
    }
    // For User
    static searchProductByUser({ keySearch }) {
        return __awaiter(this, void 0, void 0, function* () {
            const regexSearch = new RegExp(keySearch);
            return yield product
                .find({
                isPublished: true,
                $text: { $search: regexSearch },
            }, {
                score: { $meta: "textScore" },
            })
                .sort({ score: { $meta: "textScore" } })
                .lean();
        });
    }
    static findAllProducts({ limit, sort, page, filter, select }) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
            return product
                .find(filter)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                .select(getSelectData(select))
                .lean();
        });
    }
    static findProduct({ product_id, unSelect }) {
        return __awaiter(this, void 0, void 0, function* () {
            return product
                .findById(product_id)
                .select(getUnselectData(unSelect))
                .lean();
        });
    }
    static updateProductById({ product_id, bodyUpdate, productType, isNew = true, }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield productType.findByIdAndUpdate(product_id, bodyUpdate, {
                new: isNew,
            });
        });
    }
    // Commons
    static queryOneProduct({ product_shop, product_id }) {
        return __awaiter(this, void 0, void 0, function* () {
            const foundShop = yield product.findOne({
                product_shop: new Types.ObjectId(product_shop),
                _id: new Types.ObjectId(product_id),
            });
            return foundShop || null;
        });
    }
    static queryProducts({ query, limit, skip }) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield product
                .find(query)
                .populate("product_shop", "name email -_id")
                .sort({ updatedAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean()
                .exec();
        });
    }
}
module.exports = ProductRepository;
