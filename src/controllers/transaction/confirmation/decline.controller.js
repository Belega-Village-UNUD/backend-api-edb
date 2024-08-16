const {
  Transaction,
  Cart,
  Product,
  User,
  Profile,
  Store,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { Op } = require("sequelize");

const decline = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { id } = req.user;

    const storeUserId = await Store.findOne({
      attributes: ["id", "user_id"],
      where: { user_id: id },
    });

    if (!storeUserId) {
      return response(
        res,
        404,
        false,
        "You are not a store for this transaction",
        null
      );
    }

    let transaction = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: { id: transactionId },
    });

    if (!transaction) {
      return response(
        res,
        404,
        false,
        "Transaction not found because you are not the seller of this transaction",
        null
      );
    }

    if (transaction.status !== "PENDING") {
      return response(
        res,
        400,
        false,
        "Only pending transactions can be declined",
        null
      );
    }

    let cartIds = transaction.cart_id;
    cartIds = Array.isArray(cartIds) ? cartIds : [cartIds];

    const carts = await Cart.findAll({
      where: { id: { [Op.in]: cartIds } },
    });

    for (const cart of carts) {
      if (!cart) {
        return response(res, 500, false, "There's no cart of this id", null);
      }

      const product = await Product.findOne({
        attributes: { exclude: ["image_product"] },
        where: { id: cart.product_id, display: true },
      });

      if (!product) {
        return response(res, 500, false, "There's no product of this id", null);
      }

      product.stock += cart.qty;
      await product.save();
    }

    transaction.status = "CANCEL";
    await transaction.save();

    return response(res, 200, true, "Transaction declined", 1);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = decline;
