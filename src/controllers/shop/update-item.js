const { Cart, Product, User, Transaction, Store } = require("../../models");
const { response } = require("../../utils/response.utils");
const { Op } = require("sequelize");

const updateCart = async (req, res) => {
  try {
    const { id } = req.user;
    const { product_id, qty } = req.body;

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const transactions = await Transaction.findAll({
      where: {
        user_id: user.id,
      },
      attributes: ["id", "cart_id"],
      raw: true,
    });

    const cart = await Cart.findOne({
      where: {
        id: {
          [Op.notIn]: transactions.map((transaction) => transaction.cart_id),
        },
        user_id: id,
        product_id,
      },
      attributes: ["id", "qty"],
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "image_product",
            "name_product",
            "price",
            "stock",
            "desc_product",
            "type_id",
          ],
          include: {
            model: Store,
            as: "store",
            attributes: ["id", "name", "phone", "address", "description"],
          },
        },
      ],
    });

    if (!cart) {
      return response(res, 404, false, "Item not found in cart", null);
    }

    const product = await Product.findOne({
      where: { id: cart.product.id, display: true },
    });

    if (!product) {
      return response(res, 404, false, "There's no product of this id", null);
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

    await cart.update({ qty: qty });
    return response(res, 200, true, "Success update your cart", cart);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = updateCart;
