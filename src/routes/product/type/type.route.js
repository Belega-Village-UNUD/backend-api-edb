const router = require("express").Router();
const controllers = require("../../../controllers/product");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.productType.getAllType
);
router.get(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.productType.getOneType
);
router.post(
  "/",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.productType.createType
);
router.put(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.productType.updateType
);
router.delete(
  "/:id",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.productType.deleteType
);

module.exports = router;
