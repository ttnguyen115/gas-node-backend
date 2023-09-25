"use strict";
const express = require("express");
const router = express.Router();
const accessController = require("../../controllers/accessController");
const { asyncHandler } = require("../../helpers/asyncHandler");
const { authenticationV2 } = require("../../auth/authUtils");
router.post("/shop/signup", asyncHandler(accessController.signUp));
router.post("/shop/login", asyncHandler(accessController.login));
// Authentication
router.use(authenticationV2);
//=====================================================================
router.post("/shop/logout", asyncHandler(accessController.logout));
router.post("/shop/refresh_token", asyncHandler(accessController.refreshToken));
module.exports = router;
