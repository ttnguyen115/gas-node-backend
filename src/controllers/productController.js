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
   * @desc Patch to update product by id
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  updateProduct = async (req, res, next) => {
    new Created({
      message: "Update product detail successfully!",
      metadata: await ProductService.updateProduct(
        req.body.product_type,
        req.params.product_id,
        {
          ...req.body,
          product_shop: req.user.userId,
        },
      ),
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
   * @desc Get all published products for user
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  getSearchProductsForUser = async (req, res, next) => {
    new Ok({
      message: "Get search products successfully!",
      metadata: await ProductService.searchProducts(req.params),
    }).send(res);
  };

  /**
   * @desc Get all products
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  findAllProducts = async (req, res, next) => {
    new Ok({
      message: "Get all products successfully!",
      metadata: await ProductService.findAllProducts(req.query),
    }).send(res);
  };

  /**
   * @desc Get product detail
   * @param req
   * @param res
   * @param next
   * @returns {Promise<void>}
   */
  findProduct = async (req, res, next) => {
    new Ok({
      message: "Get product detail successfully!",
      metadata: await ProductService.findProduct({
        product_id: req.params.product_id,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
