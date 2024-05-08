const { nanoid } = require("nanoid");
const { Cart, User, Product, Transaction, Profile } = require("../../models");
const { response } = require("../../utils/response.utils");
const {
  MIDTRANS_SERVER_KEY,
  MIDTRANS_APP_URL,
  FE_URL,
} = require("../../utils/constan");

const checkoutProduct = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
      include: [
        {
          model: Profile,
          as: "userProfile",
          attributes: ["name", "phone"],
        },
      ],
    });

    const { product_id, qty } = req.body;

    const product = await Product.findOne({ where: { id: product_id } });
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

    const cart = await Cart.create({
      id: nanoid(10),
      product_id: product.id,
      qty,
      user_id: user.id,
      unit_price: product.price,
    });

    const transaction_id = `BLG-${nanoid(4)}-${nanoid(8)}`;

    const transaction = await Transaction.create({
      id: transaction_id,
      user_id: user.id,
      cart_id: cart.id,
      total_amount: totalAmount,
      status: "PENDING",
      token: data.token,
      redirect_url: data.redirect_url,
    });

    let transactions = [];

    transactions.push({
      totalAmount,
      transaction,
    });

    return response(res, 200, true, "Checkout successful", transactions);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = checkoutProduct;
