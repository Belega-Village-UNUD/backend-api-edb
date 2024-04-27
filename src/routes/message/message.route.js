const router = require("express").Router();
const controller = require("../../controllers/message");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.get(
  "/message-store",
  middleware.restrict,
  middleware.rbac(MODULE.MESSAGE, ROLE.BUYER, true, true),
  controller.sendMessage
);

module.exports = router;

