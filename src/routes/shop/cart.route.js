const router = require("express").Router();
const controller = require("../../controllers/shop");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.addItem
);

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.getItems
);

router.put(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.updateCart
);

router.delete(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.removeOneItem
);

router.delete(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.removeAll
);

router.post(
  "/checkout",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.checkoutCart
);

router.post(
  "/product/checkout",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.checkoutProduct
);

module.exports = router;
