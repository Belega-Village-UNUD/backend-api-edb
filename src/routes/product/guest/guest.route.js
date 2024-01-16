const router = require("express").Router();
const controllers = require("../../../controllers/product");

router.get("/all", controllers.guestProduct.getAll);
router.get("/:id", controllers.guestProduct.getOne);
router.get("/types/all", controllers.productType.getAllType);
router.get("/types/:id", controllers.productType.getOneType);

module.exports = router;
