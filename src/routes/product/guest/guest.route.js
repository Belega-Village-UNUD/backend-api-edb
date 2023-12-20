const router = require("express").Router();
const controllers = require("../../../controllers/product");

router.get("/all", controllers.guestProduct.getAll);
router.get("/:id", controllers.guestProduct.getOne);

module.exports = router;
