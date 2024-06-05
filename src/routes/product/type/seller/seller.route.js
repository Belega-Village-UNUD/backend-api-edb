const router = require("express").Router();
const middleware = require("../../../../middlewares");
const { MODULE, ROLE } = require("../../../../utils/enum.utils");
const controllers = require("../../../../controllers/product/type");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.getAll
);
router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.getOne
);

router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.create
);
router.put(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.update
);
router.delete(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  middleware.storeVerified,
  controllers.deleteType
);

module.exports = router;
