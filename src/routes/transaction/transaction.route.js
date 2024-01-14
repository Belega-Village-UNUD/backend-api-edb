const router = require("express").Router();
const controller = require("../../controllers/transaction");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");

router.post(
  "/",
  // middleware.restrict,
  // middleware.rbac(MODULE.SHOP, true, true),
  controller.getTokenMidtrans
);

module.exports = router;
