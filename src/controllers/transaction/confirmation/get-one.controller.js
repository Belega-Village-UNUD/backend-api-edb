const {
  Transaction,
  Cart,
  Product,
  User,
  Store,
  Profile,
  DetailTransaction,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { Op } = require("sequelize");

const getOneTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;

    const store = await Store.findOne({ where: { user_id } });
    if (!store) return response(res, 404, false, "Store not found", null);

    const transaction = await Transaction.findOne({
      where: { id: transaction_id },
      include: [{ model: User, as: "user", attributes: ["id", "email"] }],
    });

    if (!transaction) {
      return response(
        res,
        200,
        false,
        "No transactions found for this store and user",
        null
      );
    }

    const carts = await Cart.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            {
              model: Profile,
              as: "userProfile",
              attributes: ["id", "name"],
            },
          ],
        },
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
                  include: [
                    {
                      model: Profile,
                      as: "userProfile",
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: {
        id: { [Op.in]: transaction.cart_id },
        "$product.store_id$": store.id,
      },
    });

    const cart_details = carts.filter((cart) =>
      transaction.cart_id.includes(cart.id)
    );

    let mergedTransaction =
      cart_details.length > 0
        ? { ...transaction.toJSON(), cart_details }
        : null;

    const detailTransaction = await DetailTransaction.findAll({
      where: { transaction_id: mergedTransaction.id },
      include: [{ model: Transaction, as: "transaction", attributes: ["id"] }],
      attributes: ["id", "carts_details"],
    });

    let arrivalShippingStatus =
      detailTransaction
        .find((detail) => detail.carts_details.length)
        ?.carts_details.find((cart) => cart.arrival_shipping_status)
        ?.arrival_shipping_status || "UNCONFIRMED";

    mergedTransaction.cart_details = cart_details.map((cart) => ({
      unit_price: cart.unit_price,
      id: cart.id,
      user_id: cart.user_id,
      product_id: cart.product_id,
      qty: cart.qty,
      arrival_shipping_status: arrivalShippingStatus,
      user: cart.user,
      product: cart.product,
    }));

    return response(
      res,
      200,
      true,
      "Transaction detail retrieved successfully",
      mergedTransaction
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getOneTransaction;
