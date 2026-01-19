// import all important modules
const express = require("express");
const middleware = require("../middleware/middleware.js");

// declare router
const router = express.Router();

// import controller
const pages = require("../controller/api/pagesApiController.js");
const auth = require("../controller/api/authApiController.js");
const db = require("../controller/api/dbApiController.js");

// implementation
router.post("/pages/updatePageContent/:id", middleware.verifyToken, pages.updatePageContent);
router.post("/login", auth.processLogin);
router.post("/setSession", auth.setSession);
router.post("/checkSession", auth.checkSession);
router.post("/db/get", db.get);
router.post("/db/update", middleware.verifyToken, db.update);
module.exports = router;
