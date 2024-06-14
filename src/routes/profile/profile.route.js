const router = require("express").Router();
const controller = require("../../controllers/profile");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");
const { image, document } = require("../../configs/multer.config");

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.LANDING, ROLE.BUYER, true, false),
  controller.whoami
);
router.put(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.LANDING, ROLE.BUYER, true, false),
  middleware.buyerVerified,
  controller.updateUser
);
router.post(
  "/avatar",
  middleware.restrict,
  image.single("avatar"),
  controller.upAvatar
);
router.delete("/", controller.deleteUser);

module.exports = router;
