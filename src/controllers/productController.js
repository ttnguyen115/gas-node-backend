"use strict";

const ProductService = require("../services/productService");
const { Ok, Created } = require("../core/successResponse");

class ProductController {
  /**
   * @desc Create new product
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  createProduct = async (req, res, next) => {
    new Created({
      message: "Created new product successfully!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all drafts for shop
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  getAllDraftsForShop = async (req, res, next) => {
    new Ok({
      message: "Get all drafts for shop successfully!",
      metadata: await ProductService.findAllDraftsForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
