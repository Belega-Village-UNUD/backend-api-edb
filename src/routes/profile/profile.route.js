const router = require("express").Router();
const controller = require("../../controllers/profile");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");
const { image, document } = require("../../configs/multer.config");

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
router.post(
  "/avatar",
  middleware.restrict,
  image.single("product"),
  controller.upAvatar
);
router.delete("/", controller.deleteUser);

module.exports = router;
