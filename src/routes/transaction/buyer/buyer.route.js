const router = require("express").Router();
const controllers = require("../../../controllers/transaction");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.BUYER, true, false),
  middleware.buyerVerified,
  controllers.getAllBuyerTransactionHistory
);

router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.BUYER, true, false),
  middleware.buyerVerified,
  controllers.getOneBuyerTransactionHistory
);

router.put(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.BUYER, true, false),
  middleware.buyerVerified,
  controllers.payTransaction
);

router.put(
  "/cancel/:id",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.BUYER, true, false),
  middleware.buyerVerified,
  controllers.cancelTransaction
);
module.exports = router;
