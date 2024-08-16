const router = require("express").Router();
const { image } = require("../../configs/multer.config");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const balance = require("./balance.route");
const guest = require("./guest.route");
const { MODULE, ROLE } = require("../../utils/enum.utils");

router.get(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.STORE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.store.getProfileStore
);

router.put(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.STORE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.store.updateProfileStore
);

router.post(
  "/avatar",
  middleware.restrict,
  image.single("avatar"),
  middleware.rbac(MODULE.STORE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.store.avatarStore
);
router.post(
  "/image",
  middleware.restrict,
  image.single("image"),
  middleware.rbac(MODULE.STORE, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.store.imageStore
);

router.get(
  "/admin",
  middleware.restrict,
  middleware.rbac(MODULE.AUTH, ROLE.ADMIN, true, true),
  controllers.store.getStore
);

router.use("/balance", balance);
router.use("/guest", guest);

module.exports = router;
