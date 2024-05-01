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

    const items = req.body;

    const transactions = [];

    for (const item of items) {
      const { cart_id, qty } = item;

      const cart = await Cart.findOne({
        where: { id: cart_id },
      });
      console.log(cart.id);
      console.log(typeof cart.id);
      if (!cart) {
        return response(res, 404, false, "Cart not found", null);
      }

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

      // const cart = await Cart.findOne({
      //   where: { user_id: user.id, product_id },
      // });

      // if (!cart) {
      //   return response(res, 404, false, "Cart not found", null);
      // }

      const totalAmount = product.price * qty;
      if (cart.qty > qty) {
        cart.qty -= qty;
        await cart.save();
      } else {
        //await Cart.destroy({ where: { user_id: user.id, product_id } });
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
    console.log("🚀 ~ checkoutItem ~ error:", error);
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = checkoutItem;
