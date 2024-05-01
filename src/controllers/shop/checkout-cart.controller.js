const { nanoid } = require("nanoid");
const { Cart, User, Product, Transaction } = require("../../models");
const { response } = require("../../utils/response.utils");

const checkoutCart = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    const items = req.body;

    const transactions = [];

    for (const item of items) {
      const { cart_id } = item;

      const cart = await Cart.findOne({
        where: { id: cart_id },
      });

      if (!cart) {
        return response(res, 404, false, "Cart not found", null);
      }

      const qty = cart.qty;

      const product = await Product.findOne({ where: { id: cart.product_id } });
      if (!product) {
        return response(res, 404, false, "Product not found", null);
      }

      if (qty > product.stock) {
        return response(
          res,
          400,
          false,
          `Insufficient stock for ${product.name_product}`,
          null
        );
      }

      if (qty < 1) {
        return response(
          res,
          400,
          false,
          `Minimum quantity for ${product.name_product} is 1`,
          null
        );
      }

      product.stock -= qty;
      await product.save();

      const totalAmount = product.price * qty;
      if (cart.qty > qty) {
        cart.qty -= qty;
        await cart.save();
      } else {
        cart.qty = 0;
      }
      await cart.save();

      const transaction = await Transaction.create({
        id: nanoid(10),
        user_id: user.id,
        cart_id: cart.id,
        total_amount: totalAmount,
        status: "PENDING",
      });

      transactions.push({
        totalAmount,
        transaction,
      });
    }

    return response(res, 200, true, "Checkout successful", transactions);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = checkoutCart;
