const router = require("express").Router();
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.STORE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.store.getBalance
);

module.exports = router;
