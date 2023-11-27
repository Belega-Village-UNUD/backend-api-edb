const { Cart } = require("../../models");
const { response } = require("../../utils/response.utils");

const addItem = async (req, res) => {
  try {
    const { user_id, product_id, qty } = req.body;
    const cartItem = await Cart.create({ user_id, product_id, qty });

    return response(res, 201, true, "Cart item added", cartItem);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = addItem;
