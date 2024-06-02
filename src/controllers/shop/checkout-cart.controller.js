const { nanoid } = require("nanoid");
const { Cart, User, Product, Transaction } = require("../../models");
const { response } = require("../../utils/response.utils");
const { Op } = require("sequelize");

const checkoutCart = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    const items = req.body;

    let cartIds = items.map((item) => item.cart_id);
    cartIds = Array.isArray(cartIds) ? cartIds : [cartIds];

    const transactions = await Transaction.findAll({
      where: {
        user_id: user.id,
      },
      attributes: ["id", "cart_id"],
      raw: true,
    });

    const carts = await Cart.findAll({
      where: { id: { [Op.in]: cartIds } },
    });

    let totalAmount = 0;
    for (const cart of carts) {
      const isCheckout = cart.is_checkout ? true : false;
      if (!isCheckout) {
        const qty = cart.qty;

        const product = await Product.findOne({
          where: { id: cart.product_id },
        });

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

        const updatedCart = await Cart.update(
          {
            is_checkout: true,
          },
          {
            where: { id: cart.id },
          }
        );

        if (!updatedCart) {
          return response(res, 400, false, "Failed to checkout cart", null);
        }

        product.stock -= qty;
        await product.save();

        totalAmount += product.price * qty;
      }
      if (isCheckout) {
        // remove the cartIds
        cartIds = cartIds.filter((cartId) => cartId !== cart.id);
        return response(
          res,
          400,
          false,
          "One of your Cart already checked out",
          cartIds
        );
      }
    }

    const transaction_id = `BLG-${nanoid(4)}-${nanoid(8)}`;

    const transaction = await Transaction.create({
      id: transaction_id,
      user_id: user.id,
      cart_id: cartIds,
      total_amount: totalAmount,
      status: "PENDING",
      token: null,
      redirect_url: null,
    });

    return response(res, 200, true, "Checkout successful", transaction);
  } catch (error) {
    console.error(error);
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = checkoutCart;
