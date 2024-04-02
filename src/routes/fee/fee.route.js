const router = require("express").Router();
const { image } = require("../../configs/multer.config");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.store.avatarStore
);
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.BUYER, true, false),
  controllers.store.imageStore
);

module.exports = router;
