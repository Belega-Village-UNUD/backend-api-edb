const router = require("express").Router();
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.getFee
);
router.get(
  "/seller",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.fee.getHistory
);
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.create
);
router.put(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.update
);
router.delete(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.deleteFee
);

router.post(
  "/charged",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.charged
);
router.get(
  "/history",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.fee.getHistory
);

module.exports = router;
