const router = require("express").Router();
const controllers = require("../../../controllers/product/seller");
const middleware = require("../../../middlewares");
const { MODULE, ROLE } = require("../../../utils/enum.utils");
//const { image } = require("../../../configs/multer.config");
//const { image } = require("../../../configs/multer.config");

router.get(
  "/all",
  middleware.restrict,
  middleware.rbac(MODULE.PRODUCT, ROLE.SELLER, true, true),
  controllers.getAll
);

router.get("/:id", controllers.getOne);

//router.post(
//  "/image",
//  middleware.restrict,
//  middleware.rbac(MODULE.PRODUCT, true, true),
//  image.single("productImage"),
//  controllers.product.uploadImage
//);
// router.get(
//   "/all",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.product.getAllProduct
// );
// router.get(
//   "/:id",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.product.getOneProduct
// );
// router.post(
//   "/",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),

//   controllers.product.createProduct
// );
// router.put(
//   "/:id",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.product.updateProduct
// );
// router.delete(
//   "/:id",
//   middleware.restrict,
//   middleware.rbac(MODULE.PRODUCT, true, true),
//   controllers.product.deleteProduct
// );

module.exports = router;
