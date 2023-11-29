const router = require("express").Router();
const controller = require("../../controllers/shop");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");

router.post(
  "/",
  middleware.restrict,
  // middleware.rbac(MODULE.SHOP, true, false),
  controller.addItem
);

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, true, false),
  controller.getItems
);

router.delete(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, true, false),
  controller.removeItem
);

router.post(
  "/checkout",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, true, false),
  controller.checkoutItem
);

module.exports = router;
