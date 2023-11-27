const { Cart } = require("../../models");
const { response } = require("../../utils/response.utils");

const removeItem = async (req, res) => {
  try {
    const { id, user_id } = req.params;

    await Cart.destroy({ where: { id, user_id } });
    return response(res, 204, true, "Cart item removed", null);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = removeItem;
