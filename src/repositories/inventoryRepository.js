"use strict";

const { inventory } = require("../models/inventoryModel");

class InventoryRepository {
  static async insertInventory({
    productId,
    shopId,
    stock,
    location = "Unknown",
  }) {
    return await inventory.create({
      inven_productId: productId,
      inven_shopId: shopId,
      inven_stock: stock,
      inven_location: location,
    });
  }
}

module.exports = InventoryRepository;
