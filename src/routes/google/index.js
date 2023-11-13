const router = require("express").Router();
const controllers = require("../../controllers");

router.get("/", controllers.google.requestRefreshToken);

module.exports = router;
