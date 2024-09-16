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

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.ADMIN, true, true),
  controller.getAllTransactionsAdmin
);

router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.ADMIN, true, true),
  controller.getOneTransactionsAdmin
);

module.exports = router;
