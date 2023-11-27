const { Cart } = require("../../models");
const { response } = require("../../utils/response.utils");

const checkoutItem = async (req, res) => {
  try {
    const { user_id } = req.params;

    await Cart.destroy({ where: { user_id } });
    return response(res, 204, true, "Checkout successful", null);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = checkoutItem;
