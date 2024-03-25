const { Cart, User, Product } = require("../../models");
const { response } = require("../../utils/response.utils");

const getItems = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    const items = await Cart.findAll({ where: { user_id: user.id } });
    const unit_price = await Product.findOne({
      where: { user_id: user.id },
      attributes: ["price"],
    });

    return response(res, 200, true, "Cart items fetched", items, unit_price);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getItems;
