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
const { BadRequestRequestError, NotFoundRequestError } = require("../core/errorResponse").default;
const discountModel = require("../models/discountModel");
const { convertToObjectIdMongodb } = require("../utils");
const ProductRepository = require("../repositories/productRepository");
class DiscountService {
    static createDiscountCode(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, start_date, end_date, is_active, shopId, min_order_value, product_ids, applies_to, name, description, type, value, max_value, max_uses, uses_count, max_uses_per_user, users_used, } = payload;
            const startDate = new Date(start_date), endDate = new Date(end_date), currentDate = new Date();
            if (currentDate < startDate || currentDate > endDate) {
                throw new BadRequestRequestError("Discount code has expired!");
            }
            if (startDate >= endDate) {
                throw new BadRequestRequestError("Start date must be before end date!");
            }
            const foundDiscount = yield discountModel
                .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
                .lean();
            if (foundDiscount && foundDiscount.discount_is_active) {
                throw new BadRequestRequestError("Discount code already exists!");
            }
            return yield discountModel.create({
                discount_name: name,
                discount_description: description,
                discount_type: type,
                discount_code: code,
                discount_value: value,
                discount_min_order_value: min_order_value || 0,
                discount_max_value: max_value,
                discount_start_date: startDate,
                discount_end_date: endDate,
                discount_max_uses: max_uses,
                discount_uses_count: uses_count,
                discount_users_used: users_used,
                discount_shopId: shopId,
                discount_max_uses_per_users: max_uses_per_user,
                discount_is_active: is_active,
                discount_applies_to: applies_to,
                discount_product_ids: applies_to === "all" ? [] : product_ids,
            });
        });
    }
    static updateDiscountCode(payload) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    static getAllDiscountCodesWithProduct(payload) {
        return __awaiter(this, void 0, void 0, function* () {
            const { code, shopId, userId, limit, page } = payload;
            const foundDiscount = yield discountModel
                .findOne({
                discount_code: code,
                discount_shopId: convertToObjectIdMongodb(shopId),
            })
                .lean();
            if (!foundDiscount || !foundDiscount.discount_is_active) {
                throw new NotFoundRequestError("Discount code does not exist!");
            }
            const { discount_applies_to, discount_product_ids } = foundDiscount;
            let products = [];
            if (discount_applies_to === "all") {
                products = yield ProductRepository.findAllProducts({
                    limit: +limit,
                    page: +page,
                    sort: "ctime",
                    select: ["product_name"],
                    filter: {
                        product_shop: convertToObjectIdMongodb(shopId),
                        isPublished: true,
                    },
                });
            }
            if (discount_applies_to === "specific") {
                products = yield ProductRepository.findAllProducts({
                    limit: +limit,
                    page: +page,
                    sort: "ctime",
                    select: ["product_name"],
                    filter: {
                        _id: { $in: discount_product_ids },
                        isPublished: true,
                    },
                });
            }
            return products;
        });
    }
    static getAllDiscountCopdesByShop(payload) {
        return __awaiter(this, void 0, void 0, function* () { });
    }
}
module.exports = DiscountService;
