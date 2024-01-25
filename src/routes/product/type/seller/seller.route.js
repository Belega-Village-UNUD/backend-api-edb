const router = require("express").Router();
// const middleware = require("../../../middlewares");
// const { MODULE } = require("../../../utils/enum.utils");

const controllers = require("../../../../controllers/product/type/seller");

router.get("/all", controllers.getAll);
// router.get("/:id", controllers.getOne);

// router.get(
//   "/all",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.productType.getAllType
// );
// router.get(
//   "/:id",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.productType.getOneType
// );
// router.post(
//   "/",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.productType.createType
// );
// router.put(
//   "/:id",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.productType.updateType
// );
// router.delete(
//   "/:id",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.productType.deleteType
// );

module.exports = router;
