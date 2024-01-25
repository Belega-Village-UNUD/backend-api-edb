const router = require("express").Router();
const guest = require("./guest/guest.route");
const buyer = require("./buyer/buyer.route");
const seller = require("./seller/seller.route");

router.use("/guest", guest);
router.use("/buyer", buyer);
router.use("/seller", seller);

module.exports = router;
