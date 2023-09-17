"use strict";

const express = require("express");
const router = express.Router();
const productController = require("../../controllers/productController");
const { asyncHandler } = require("../../auth/authUtils");

module.exports = router;
