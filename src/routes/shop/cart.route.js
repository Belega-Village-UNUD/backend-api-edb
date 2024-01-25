const router = require("express").Router();
const controller = require("../../controllers/shop");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.USER, true, true),
  controller.addItem
);

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.USER, true, true),
  controller.getItems
);

router.delete(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.USER, true, true),
  controller.removeItem
);

router.post(
  "/checkout",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.USER, true, true),
  controller.checkoutItem
);

module.exports = router;
