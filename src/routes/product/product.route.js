const router = require("express").Router();
const typeRouter = require("./type/type.route");
const controllers = require("../../controllers");
const middleware = require("../../middlewares");
const { MODULE } = require("../../utils/enum.utils");

router.get(
  "/all",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.getAll
)
router.get(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.getOne
)
router.post(
  "/", 
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.create
)
router.put(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.update
)
router.delete(
  "/:id",
  middleware.restrict,
  // middleware.rbac(MODULE.PRODUCT, true, false),
  controllers.product.deleteProduct
)

router.use("/type", typeRouter)

module.exports = router;
