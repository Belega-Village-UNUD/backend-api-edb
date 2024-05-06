const router = require("express").Router();
const controller = require("../../controllers/shop");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  controller.addItem
);

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  controller.getItems
);

router.delete(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  controller.removeItem
);

router.delete(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  controller.removeAll
);

router.post(
  "/checkout",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  controller.checkoutCart
);

router.post(
  "/product/checkout",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  controller.checkoutProduct
);

module.exports = router;
