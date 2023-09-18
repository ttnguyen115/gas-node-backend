"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/productModel");
const { BadRequestRequestError } = require("../core/errorResponse");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestRequestError(`Invalid product type ${type}.`);
    return new productClass(payload).createProduct();
  }
}

class Product {
  constructor({
    product_name,
    product_thumb,
    product_description,
    product_price,
    product_quantity,
    product_type,
    product_shop,
    product_attributes,
  }) {
    this.product_name = product_name;
    this.product_thumb = product_thumb;
    this.product_description = product_description;
    this.product_price = product_price;
    this.product_quantity = product_quantity;
    this.product_type = product_type;
    this.product_shop = product_shop;
    this.product_attributes = product_attributes;
  }

  async createProduct(product_id) {
    return await product.create({ ...this, _id: product_id });
  }
}

class Clothing extends Product {
  async createProduct() {
    const newClothing = await clothing.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newClothing)
      throw new BadRequestRequestError("Create Clothing attributes failed.");

    const newProduct = await super.createProduct(newClothing._id);
    if (!newProduct)
      throw new BadRequestRequestError("Create Clothing product failed.");

    return newProduct;
  }
}

class Electronics extends Product {
  async createProduct() {
    const newElectronic = await electronic.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newElectronic)
      throw new BadRequestRequestError("Create Electronic attributes failed.");

    const newProduct = await super.createProduct(newElectronic._id);
    if (!newProduct)
      throw new BadRequestRequestError("Create Electronic product failed.");

    return newProduct;
  }
}

class Furniture extends Product {
  async createProduct() {
    const newFurniture = await furniture.create({
      ...this.product_attributes,
      product_shop: this.product_shop,
    });
    if (!newFurniture)
      throw new BadRequestRequestError("Create Furniture attributes failed.");

    const newProduct = await super.createProduct(newFurniture._id);
    if (!newProduct)
      throw new BadRequestRequestError("Create Furniture product failed.");

    return newProduct;
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
