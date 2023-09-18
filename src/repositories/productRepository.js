"use strict";

const {
  electronic,
  clothing,
  furniture,
  product,
} = require("../models/productModel");

class ProductRepository {
  static async findAllDraftsForShop({ query, limit, skip }) {
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
