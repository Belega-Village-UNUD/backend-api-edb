const { nanoid } = require("nanoid");
const {
  Cart,
  User,
  Product,
  Transaction,
  Profile,
  Store,
} = require("../../models");
const { response } = require("../../utils/response.utils");
const { validateRequestBody } = require("../../utils/token.utils");

const checkoutProduct = async (req, res) => {
  try {
    validateRequestBody(req);
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

    const product = await Product.findOne({
      where: { id: product_id, display: true },
      attributes: { exclude: ["images"] },
      include: [
        {
          model: Store,
          as: "store",
          attributes: ["id", "name", "user_id"],
        },
      ],
    });
    if (!product) {
      return response(res, 404, false, "Product not found", null);
    }

    if (product.store.user_id === id) {
      return response(
        res,
        400,
        false,
        "You cannot checkout your own store's product",
        null
      );
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

    let productWeight = qty * product.weight_gr;

    let belowMaxWeight = productWeight > 30000 ? false : true;
    if (!belowMaxWeight) {
      return response(
        res,
        400,
        false,
        `Product: ${product.name_product} total must be less than 30 kg, try reducing your quantity`,
        product
      );
    }

    product.stock -= qty;
    await product.save();

    const totalAmount = product.price * qty;

    const storeStatus = {};

    if (!storeStatus[product.store_id]) {
      storeStatus[product.store_id] = {
        store_id: product.store_id,
        status_store: "pending",
      };
    }

    const cart = await Cart.create({
      id: nanoid(10),
      product_id: product.id,
      qty,
      user_id: user.id,
      is_checkout: true,
      unit_price: product.price,
    });

    const transaction_id = `BLG-${nanoid(4)}-${nanoid(8)}`;

    const transaction = await Transaction.create({
      id: transaction_id,
      user_id: user.id,
      cart_id: [cart.id],
      total_amount: totalAmount,
      status: "PENDING",
      token: null,
      redirect_url: null,
      status_store: Object.values(storeStatus),
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
