const { Cart } = require("../../models");
const { response } = require("../../utils/response.utils");

const removeItem = async (req, res) => {
  try {
    const { id } = req.user;
    const { product_id, qty } = req.body;
    const cartItem = await Cart.findOne({ where: { user_id: id, product_id } });

    if (cartItem.qty > qty) {
      await cartItem.update({ qty: cartItem.qty - qty });
      return response(res, 200, true, "Cart item quantity updated", null);
    }
    await Cart.destroy({ where: { id: cartItem.id } });
    return response(res, 200, true, "Cart item removed", null);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = removeItem;
