const router = require("express").Router();
const controllers = require("../../../controllers/product");

router.get("/all", controllers.getAllProductGuest);
router.get("/:id", controllers.getOneProductGuest);

module.exports = router;
