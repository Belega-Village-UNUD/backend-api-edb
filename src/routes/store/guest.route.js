const router = require("express").Router();
const controllers = require("../../controllers/store");

router.get("/info", controllers.getStoreInfo);

module.exports = router;
