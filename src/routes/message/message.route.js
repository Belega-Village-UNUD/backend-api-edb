const router = require("express").Router();
const controller = require("../../controllers/message");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post(
  "/store",
  middleware.restrict,
  middleware.rbac(MODULE.MESSAGE, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.sendMessageGreetSeller
);

router.post(
  "/product",
  middleware.restrict,
  middleware.rbac(MODULE.MESSAGE, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.sendMessageAskProduct
);

module.exports = router;
