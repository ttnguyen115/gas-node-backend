"use strict";

const { product } = require("../models/productModel");
const { Types } = require("mongoose");
const { getSelectData, getUnselectData } = require("../utils");

class ProductRepository {
  // For Shop
  static async findAllDraftsForShop({ query, limit, skip }) {
    return await this.queryProducts({ query, limit, skip });
  }

  static async findAllPublishForShop({ query, limit, skip }) {
    return await this.queryProducts({ query, limit, skip });
  }

  static async publishProductByShop({ product_shop, product_id }) {
    const foundShop = await this.queryOneProduct({ product_shop, product_id });
    if (!foundShop) return null;

    foundShop.isDraft = false;
    foundShop.isPublished = true;
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    const foundShop = await this.queryOneProduct({ product_shop, product_id });
    if (!foundShop) return null;

    foundShop.isDraft = true;
    foundShop.isPublished = false;
    const { modifiedCount } = await foundShop.updateOne(foundShop);
    return modifiedCount;
  }

  // For User
  static async searchProductByUser({ keySearch }) {
    const regexSearch = new RegExp(keySearch);
    return await product
      .find(
        {
          isPublished: true,
          $text: { $search: regexSearch },
        },
        {
          score: { $meta: "textScore" },
        },
      )
      .sort({ score: { $meta: "textScore" } })
      .lean();
  }

  static async findAllProducts({ limit, sort, page, filter, select }) {
    const skip = (page - 1) * limit;
    const sortBy = sort === "ctime" ? { _id: -1 } : { _id: 1 };
    return product
      .find(filter)
      .sort(sortBy)
      .skip(skip)
      .limit(limit)
      .select(getSelectData(select))
      .lean();
  }

  static async findProduct({ product_id, unSelect }) {
    return product
      .findById(product_id)
      .select(getUnselectData(unSelect))
      .lean();
  }

  static async updateProductById({
    product_id,
    bodyUpdate,
    productType,
    isNew = true,
  }) {
    return await productType.findByIdAndUpdate(product_id, bodyUpdate, {
      new: isNew,
    });
  }

  // Commons
  static async queryOneProduct({ product_shop, product_id }) {
    const foundShop = await product.findOne({
      product_shop: new Types.ObjectId(product_shop),
      _id: new Types.ObjectId(product_id),
    });
    return foundShop || null;
  }

  static async queryProducts({ query, limit, skip }) {
    return await product
      .find(query)
      .populate("product_shop", "name email -_id")
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec();
  }
}

module.exports = ProductRepository;
