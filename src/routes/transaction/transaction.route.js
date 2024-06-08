const router = require("express").Router();
const controller = require("../../controllers/transaction");
const middleware = require("../../middlewares");
const buyer = require("./buyer/buyer.route");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post("/", middleware.restrict, controller.getTokenMidtrans);

router.put(
  "/confirm/:id",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controller.confirmOrder
);

router.put(
  "/decline/:id",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controller.declineOrder
);

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controller.getAllTransactions
);

router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controller.getOneTransaction
);

router.use("/buyer", buyer);

module.exports = router;
