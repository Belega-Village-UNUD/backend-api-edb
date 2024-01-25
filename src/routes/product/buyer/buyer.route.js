const router = require("express").Router();
const controllers = require("../../../controllers/product/buyer");

router.get("/all", controllers.getAll);
router.get("/:id", controllers.getOne);

module.exports = router;
