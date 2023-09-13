"use strict";

const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/accessController");
const { asyncHandler } = require("../../auth/checkAuth");

router.post("/shop/signup", asyncHandler(accessController.signUp));

module.exports = router;
