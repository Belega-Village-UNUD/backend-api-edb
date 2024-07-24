const router = require("express").Router();
const controller = require("../../../controllers");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");

router.put(
  "/send",
  middleware.restrict,
  middleware.rbac(MODULE.MESSAGE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controller.shipping.send
);

module.exports = router;
