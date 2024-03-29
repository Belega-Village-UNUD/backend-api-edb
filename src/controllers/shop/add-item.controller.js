const { nanoid } = require("nanoid");
const { Cart, User, Product } = require("../../models");
const { response } = require("../../utils/response.utils");

const addItem = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    const { product_id, qty } = req.body;

    const product = await Product.findOne({
      where: { user_id: user.id },
      attributes: ["price"],
    });

    await Cart.create({
      id: nanoid(10),
      user_id: user.id,
      product_id,
      qty,
      unit_price: product.price,
    });

    const cart = await Cart.findAll({
      where: { user_id: user.id },
    });

    return response(res, 201, true, "Cart item added", cart);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = addItem;
