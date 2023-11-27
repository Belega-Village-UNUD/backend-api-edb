const router = require("express").Router();
const controller = require("../../controllers/shop");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");

router.post(
  "/cart/add",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, true, false),
  controller.add
);

router.get(
  "/cart/:user_id",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, true, false),
  controller.get
);

router.delete(
  "/cart/:id/:user_id",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, true, false),
  controller.remove
);

router.post(
  "/cart/checkout/:user_id",
  middleware.restrict,
  middleware.rbac(MODULE.SHOP, true, false),
  controller.checkout
);
