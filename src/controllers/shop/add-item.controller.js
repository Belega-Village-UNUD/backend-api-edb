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
      where: { id: product_id },
      attributes: ["price", "stock", "name_product"],
    });

    if (qty === 0) {
      return response(
        res,
        400,
        false,
        `Minimum quantity for ${product.name_product} is 1`,
        null
      );
    }

    const existingCartItem = await Cart.findOne({
      where: { user_id: user.id, product_id },
    });

    if (existingCartItem) {
      if (existingCartItem.qty + qty > product.stock) {
        return response(
          res,
          400,
          false,
          `Insufficient stock for ${product.name_product}`,
          null
        );
      }
      await existingCartItem.update({
        qty: existingCartItem.qty + qty,
      });
    } else {
      await Cart.create({
        id: nanoid(10),
        user_id: user.id,
        product_id,
        qty,
        unit_price: product.price,
      });
    }

    const cart = await Cart.findAll({
      where: { user_id: user.id },
    });

    return response(res, 201, true, "Cart item added", cart);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = addItem;
