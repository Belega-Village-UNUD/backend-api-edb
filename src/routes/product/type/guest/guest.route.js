const router = require("express").Router();
const controllers = require("../../../../controllers/product/type/guest");

router.get("/all", controllers.getAll);
// router.get("/:id", controllers.getOne);

module.exports = router;