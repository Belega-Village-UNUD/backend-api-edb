const { nanoid } = require("nanoid");
const { Cart, User, Product, Transaction } = require("../../models");
const { response } = require("../../utils/response.utils");

const checkoutItem = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    const { product_id, qty } = req.body;

    const product = await Product.findOne({ where: { id: product_id } });
    if (!product) {
      return response(res, 404, false, "Product not found", null);
    }

    if (qty > product.stock) {
      return response(res, 400, false, "Insufficient stock", null);
    }

    if (qty < 1) {
      return response(res, 400, false, "Minimum quantity is 1", null);
    }

    product.stock -= qty;
    await product.save();

    const transaction = await Transaction.create({
      id: nanoid(10),
      user_id: user.id,
      total_amount: product.price * qty,
      status: true,
    });

    await Cart.destroy({ where: { user_id: user.id, product_id, qty } });
    return response(res, 200, true, "Checkout successful", transaction);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = checkoutItem;
