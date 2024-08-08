const router = require("express").Router();
const controller = require("../../../controllers/transaction");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");

router.get(
  "/reports",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controller.getTransactionReports
);

module.exports = router;
