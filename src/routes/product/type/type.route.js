const router = require("express").Router();
const controllers = require("../../../controllers/product");
const middleware = require("../../../middlewares");
const { MODULE } = require("../../../utils/enum.utils");

router.get(
  "/all",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.productType.getAllType
);
router.get(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.productType.getOneType
);
router.post(
  "/",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.productType.createType
);
router.put(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.productType.updateType
);
router.delete(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.productType.deleteType
);

module.exports = router;
