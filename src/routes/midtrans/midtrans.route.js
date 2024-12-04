const router = require("express").Router();
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.get(
  "/status",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.BUYER, true, false),
  middleware.buyerVerified,
  controllers.midtrans.checkStatus
);

router.post("/callback", controllers.midtrans.callbackMidtrans);

module.exports = router;
