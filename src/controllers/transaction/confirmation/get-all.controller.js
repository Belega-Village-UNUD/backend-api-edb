const {
  Transaction,
  Cart,
  Product,
  User,
  Store,
  Profile,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { Op } = require("sequelize");

const getAllTransactions = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const store = await Store.findOne({ where: { user_id } });

    if (!store) return response(res, 404, false, "Store not found", null);

    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
    });

    const cartIds = [].concat(
      ...transactions.map((transaction) => transaction.cart_id)
    );

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
        id: { [Op.in]: cartIds },
        "$product.store_id$": store.id,
      },
    });

    if (!transactions || transactions.length === 0) {
      return response(
        res,
        200,
        false,
        "No transactions found for this store and user",
        null
      );
    }

    const mergedTransactions = transactions
      .map((transaction) => {
        const cart_details = transaction.cart_id
          .map((id) => {
            const cart = carts.find((cart) => cart.id === id);
            return cart || null;
          })
          .filter((cart) => cart !== null);

        if (cart_details.length > 0) {
          return { ...transaction.toJSON(), cart_details };
        }

        return null;
      })
      .filter((transaction) => transaction !== null);

    return response(
      res,
      200,
      true,
      "Transactions retrieved successfully",
      mergedTransactions
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getAllTransactions;
