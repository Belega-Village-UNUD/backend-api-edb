const router = require("express").Router();
const typeRouter = require("./type/type.route");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");

router.get(
  "/all",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.getAllProduct
);
router.get(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.getOneProduct
);
router.post(
  "/",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.createProduct
);
router.put(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.updateProduct
);
router.delete(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.deleteProduct
);

router.use("/types", typeRouter);

module.exports = router;
