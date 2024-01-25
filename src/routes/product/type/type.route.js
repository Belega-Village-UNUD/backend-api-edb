const router = require("express").Router();
const guest = require("./guest/guest.route");
const seller = require("./seller/seller.route");
const buyer = require("./buyer/buyer.route");

router.use("/guest", guest);
router.use("/seller", seller);
router.use("/buyer", buyer);

module.exports = router;
