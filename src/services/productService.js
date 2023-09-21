"use strict";

const {
  product,
  clothing,
  electronic,
  furniture,
} = require("../models/productModel");
const { BadRequestRequestError } = require("../core/errorResponse");
const ProductRepository = require("../repositories/productRepository");
const InventoryRepository = require("../repositories/inventoryRepository");
const { removeNullObject, updateNestedObjectParser } = require("../utils");

class ProductFactory {
  static productRegistry = {};

  static registerProductType(type, classRef) {
    ProductFactory.productRegistry[type] = classRef;
  }

  static async findAllDraftsForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isDraft: true };
    return await ProductRepository.findAllDraftsForShop({ query, limit, skip });
  }

  static async findAllPublishForShop({ product_shop, limit = 50, skip = 0 }) {
    const query = { product_shop, isPublished: true };
    return await ProductRepository.findAllPublishForShop({
      query,
      limit,
      skip,
    });
  }

  static async searchProducts({ keySearch }) {
    return await ProductRepository.searchProductByUser({ keySearch });
  }

  static async findAllProducts({
    limit = 50,
    sort = "ctime",
    page = 1,
    filter = { isPublished: true },
  }) {
    return await ProductRepository.findAllProducts({
      limit,
      sort,
      page,
      filter,
      select: ["product_name", "product_price", "product_thumb"],
    });
  }

  static async findProduct({ product_id }) {
    return await ProductRepository.findProduct({
      product_id,
      unSelect: ["__v"],
    });
  }

  static async createProduct(type, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestRequestError(`Invalid product type ${type}.`);
    return new productClass(payload).createProduct();
  }

  static async updateProduct(type, product_id, payload) {
    const productClass = ProductFactory.productRegistry[type];
    if (!productClass)
      throw new BadRequestRequestError(`Invalid product type ${type}.`);
    return new productClass(payload).updateProduct(product_id);
  }

  static async publishProductByShop({ product_shop, product_id }) {
    return await ProductRepository.publishProductByShop({
      product_shop,
      product_id,
    });
  }

  static async unPublishProductByShop({ product_shop, product_id }) {
    return await ProductRepository.unPublishProductByShop({
      product_shop,
      product_id,
    });
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
    const newProduct = await product.create({ ...this, _id: product_id });
    if (newProduct) {
      await InventoryRepository.insertInventory({
        productId: newProduct._id,
        shopId: this.product_shop,
        stock: this.product_quantity,
      });
    }
    return newProduct;
  }

  async updateProduct(product_id, bodyUpdate) {
    return await ProductRepository.updateProductById({
      product_id,
      bodyUpdate,
      productType: product,
    });
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

  async updateProduct(product_id) {
    const objectParams = removeNullObject(this);
    if (objectParams.product_attributes) {
      await ProductRepository.updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        productType: clothing,
      });
    }
    return await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams),
    );
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

  async updateProduct(product_id) {
    const objectParams = removeNullObject(this);
    if (objectParams.product_attributes) {
      await ProductRepository.updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        productType: electronic,
      });
    }
    return await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams),
    );
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

  async updateProduct(product_id) {
    const objectParams = removeNullObject(this);
    if (objectParams.product_attributes) {
      await ProductRepository.updateProductById({
        product_id,
        bodyUpdate: updateNestedObjectParser(objectParams.product_attributes),
        productType: furniture,
      });
    }
    return await super.updateProduct(
      product_id,
      updateNestedObjectParser(objectParams),
    );
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
