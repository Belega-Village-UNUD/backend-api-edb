const router = require("express").Router();
const controller = require("../../controllers/profile");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.LANDING, true, false),
  controller.whoami
);

module.exports = router;
