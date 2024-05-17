const addItem = require("./add-item.controller");
const getItems = require("./get-item.controller");
const updateCart = require("./update-item");
const removeOneItem = require("./remove-one-item.controller");
const checkoutCart = require("./checkout-cart.controller");
const checkoutProduct = require("./checkout-product.controller");
const removeAll = require("./remove-all.controller");

module.exports = {
  addItem,
  getItems,
  updateCart,
  removeOneItem,
  checkoutCart,
  checkoutProduct,
  removeAll,
};
