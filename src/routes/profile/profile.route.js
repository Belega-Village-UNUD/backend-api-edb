const router = require("express").Router();
const controller = require("../../controllers/profile");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");
const avatar = require("./avatar/avatar.route");

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.LANDING, true, false),
  controller.whoami
);
router.put(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.LANDING, true, false),
  controller.updateUser
);
router.use("/avatar", avatar);
router.delete("/", controller.deleteUser);

module.exports = router;
