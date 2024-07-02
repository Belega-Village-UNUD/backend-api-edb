const router = require("express").Router();
const controller = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");
const seller = require("./seller/seller.route");

router.get(
  "/city",
  middleware.restrict,
  middleware.rbac(MODULE.MESSAGE, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.shipping.getCity
);

router.get(
  "/province",
  middleware.restrict,
  middleware.rbac(MODULE.MESSAGE, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.shipping.getProvince
);

router.post(
  "/costs/:transaction_id",
  middleware.restrict,
  middleware.rbac(MODULE.MESSAGE, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.shipping.costs
);

router.put(
  "/arrived",
  middleware.restrict,
  middleware.rbac(MODULE.MESSAGE, ROLE.BUYER, true, true),
  middleware.buyerVerified,
  controller.shipping.arrived
);

router.use("/seller", seller);

module.exports = router;
