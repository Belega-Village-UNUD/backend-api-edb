const router = require("express").Router();
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");
const controllers = require("../../controllers");

// router.get(
//   "/",
//   middleware.restrict,
//   middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
//   controllers.fee.getFee
// );
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.FEE, ROLE.ADMIN, true, true),
  controllers.payout.requestPayout
);
module.exports = router;