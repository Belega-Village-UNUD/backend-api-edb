const router = require("express").Router();
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

// TODO: modify into webhook need further research
router.get(
  "/status",
  middleware.restrict,
  middleware.rbac(MODULE.TRANSACTION, ROLE.BUYER, true, false),
  middleware.buyerVerified,
  controllers.midtrans.checkStatus
);

module.exports = router;
