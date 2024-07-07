const router = require("express").Router();
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");
const controllers = require("../../controllers");

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.payout.getPayout
);
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.payout.requestPayout
);

router.put(
  "/admin/confirm",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.payout.confirmPayout
);
module.exports = router;
