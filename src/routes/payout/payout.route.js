const router = require("express").Router();
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");
const controllers = require("../../controllers");
const { image } = require("../../configs/multer.config");

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

router.get(
  "/admin",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.payout.getPayoutAdmin
);
router.put(
  "/admin/confirm",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.payout.confirmPayout
);
router.post(
  "/admin/proof",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  image.single("proof"),
  controllers.payout.proofPayout
);
module.exports = router;
