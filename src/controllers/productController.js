"use strict";

const ProductService = require("../services/productService");
const { Ok, Created } = require("../core/successResponse");

class ProductController {
  createProduct = async (req, res) => {
    new Created({
      message: "Created new product successfully!",
      metadata: await ProductService.createProduct(req.body.product_type, {
        ...req.body,
        product_shop: req.user.userId,
      }),
    }).send(res);
  };
}

module.exports = new ProductController();
