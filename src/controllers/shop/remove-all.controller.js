const { Cart, User } = require("../../models");
const { response } = require("../../utils/response.utils");

const removeAll = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    const cartItems = await Cart.findAll({
      where: { user_id: user.id },
    });

    if (cartItems.length === 0) {
      return response(res, 200, true, "No items in cart", null);
    }

    await Cart.destroy({
      where: { user_id: user.id },
    });

    return response(res, 200, true, "All items removed from cart", null);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = removeAll;
