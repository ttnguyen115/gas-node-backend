"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const { authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");

router.get(
  "/search/:keySearch",
  asyncHandler(productController.getSearchProductsForUser),
);

// Authentication middleware
router.use(authenticationV2);
//==========================
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));
router.get(
  "/published/all",
  asyncHandler(productController.getAllPublishForShop),
);

router.post("", asyncHandler(productController.createProduct));

router.put(
  "/publish/:id",
  asyncHandler(productController.publishProductForShop),
);
router.put(
  "/unpublish/:id",
  asyncHandler(productController.unPublishProductByShop),
);

module.exports = router;
