const router = require("express").Router();
const controller = require("../../controllers/transaction");
const middleware = require("../../middlewares");

router.post("/", middleware.restrict, controller.getTokenMidtrans);

module.exports = router;
