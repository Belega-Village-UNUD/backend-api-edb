const router = require("express").Router();
const { image } = require("../../configs/multer.config");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.post(
  "/avatar",
  middleware.restrict,
  image.single("avatar"),
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.store.avatarStore
);
router.post(
  "/image",
  middleware.restrict,
  image.single("image"),
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.store.imageStore
);

module.exports = router;
