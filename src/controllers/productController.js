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
   * @desc Change publish product status by shop
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  publishProductForShop = async (req, res, next) => {
    new Created({
      message: "Published product successfully!",
      metadata: await ProductService.publishProductByShop({
        product_id: req.params.id,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Change publish product status by shop
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  unPublishProductByShop = async (req, res, next) => {
    new Created({
      message: "Unpublished product successfully!",
      metadata: await ProductService.unPublishProductByShop({
        product_id: req.params.id,
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

  /**
   * @desc Get all published products for shop
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  getAllPublishForShop = async (req, res, next) => {
    new Ok({
      message: "Get all drafts for shop successfully!",
      metadata: await ProductService.findAllPublishForShop({
        product_shop: req.user.userId,
      }),
    }).send(res);
  };

  /**
   * @desc Get all published products for shop
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  getSearchProductsForUser = async (req, res, next) => {
    new Ok({
      message: "Get search products successfully!",
      metadata: await ProductService.searchProduct({
        keySearch: req.params,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
