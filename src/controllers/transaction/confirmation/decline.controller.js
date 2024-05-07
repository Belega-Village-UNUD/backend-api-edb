const {
  Transaction,
  Cart,
  Product,
  User,
  Profile,
  Store,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");

const decline = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { id } = req.user;

    const storeUserId = await Store.findOne({
      attributes: ["user_id"],
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
      attributes: ["id", "user_id", "status", "createdAt"],
      include: [
        {
          model: Cart,
          as: "cart",
          attributes: ["id", "user_id", "product_id", "qty", "unit_price"],
          include: [
            {
              model: Product,
              as: "product",
              include: [
                {
                  model: Store,
                  as: "store",
                  attributes: ["id", "name"],
                  include: [
                    {
                      model: User,
                      as: "user",
                      attributes: ["id", "email"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: {
        "$cart.product.store.user.id$": storeUserId.user_id,
        id: transactionId,
      },
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

    const cart = await Cart.findOne({
      where: { id: transaction.cart.id },
    });

    if (!cart) {
      return response(res, 500, false, "There's no cart of this id", null);
    }

    const product = await Product.findOne({
      where: { id: cart.product_id },
    });

    if (!product) {
      return response(res, 500, false, "There's no product of this id", null);
    }

    product.stock += cart.qty;
    await product.save();

    transaction.status = "CANCEL";
    await transaction.save();

    return response(res, 200, true, "Transaction declined", transaction);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = decline;
