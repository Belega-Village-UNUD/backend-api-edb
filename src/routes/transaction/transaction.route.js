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
  controller.confirmOrder
);

router.put(
  "/decline/:id",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.SELLER, true, true),
  controller.declineOrder
);

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.SELLER, true, true),
  controller.getAllTransactions
);

router.use("/buyer", buyer);

module.exports = router;
