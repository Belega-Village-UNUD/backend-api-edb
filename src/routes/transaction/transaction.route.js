const router = require("express").Router();
const controller = require("../../controllers/transaction");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post("/", middleware.restrict, controller.getTokenMidtrans);

router.put(
  "/confirm/:transactionId",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.SELLER, true, true),
  controller.confirmOrder
);

router.put(
  "/decline/:transactionId",
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

module.exports = router;
