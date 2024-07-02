const router = require("express").Router();
const middleware = require("../../middlewares");
const controllers = require("../../controllers");
const { ROLE, MODULE } = require("../../utils/enum.utils");

router.get(
  "/listbank",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, false),
  middleware.buyerVerified,
  controllers.bankAccount.getListBank
);
router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, false),
  middleware.storeVerified,
  controllers.bankAccount.getBank
);
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.bankAccount.createBankAccount
);
router.put(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.bankAccount.updateBankAccount
);
router.delete(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.bankAccount.deleteBankAccount
);
router.get(
  "/admin",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, false),
  controllers.bankAccount.getBank
);
router.get(
  "/admin/listbank",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, false),
  controllers.bankAccount.getListBank
);

module.exports = router;
