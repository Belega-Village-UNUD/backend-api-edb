const router = require("express").Router();
const middleware = require("../../../../middlewares");
const { MODULE, ROLE } = require("../../../../utils/enum.utils");
const controllers = require("../../../../controllers/product/type");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.getAll
);
router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.getOne
);

router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.create
);
router.put(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.update
);
router.delete(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.deleteType
);

module.exports = router;
