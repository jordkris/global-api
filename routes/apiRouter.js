// import all important modules
const express = require("express");

// declare router
const router = express.Router();

// import controller
const usernameChecker = require("../controller/api/usernameChecker.js");

// implementation
// router.post("/pages/updatePageContent/:id", middleware.verifyToken, pages.updatePageContent);
router.post("/usernameChecker/instagram", usernameChecker.instagram);
module.exports = router;
