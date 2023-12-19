const { Cart, User } = require("../../models");
const { response } = require("../../utils/response.utils");

const getItems = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    const items = await Cart.findAll({ where: { user_id: user.id } });

    return response(res, 200, true, "Cart items fetched", items);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getItems;
