const router = require("express").Router();
const controller = require("../../../controllers/transaction");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");

router.get(
  "/reports",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.ADMIN, true, true),
  controller.getAllTransactionsReports
);

module.exports = router;
