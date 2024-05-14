const addItem = require("./add-item.controller");
const getItems = require("./get-item.controller");
const increaseItem = require("./increase-item.controller");
const reduceItem = require("./reduce-item.controller");
const checkoutCart = require("./checkout-cart.controller");
const checkoutProduct = require("./checkout-product.controller");
const removeAll = require("./remove-all.controller");

module.exports = {
  addItem,
  getItems,
  increaseItem,
  reduceItem,
  checkoutCart,
  checkoutProduct,
  removeAll,
};
