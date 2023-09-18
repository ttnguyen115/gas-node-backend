"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const { authenticationV2 } = require("../../auth/authUtils");
const { asyncHandler } = require("../../helpers/asyncHandler");

// Authentication middleware
router.use(authenticationV2);
//==========================
router.get("/drafts/all", asyncHandler(productController.getAllDraftsForShop));

router.post("", asyncHandler(productController.createProduct));

module.exports = router;
