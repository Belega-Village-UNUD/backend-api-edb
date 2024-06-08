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

const getOneTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;

    const store = await Store.findOne({ where: { user_id } });

    if (!store) return response(res, 404, false, "Store not found", null);

    const transaction = await Transaction.findOne({
      where: { id: transaction_id },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
    });

    let cartIds = transaction.cart_id;
    cartIds = Array.isArray(cartIds) ? cartIds : [cartIds];

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

    if (!transaction || transaction.length === 0) {
      return response(
        res,
        200,
        false,
        "No transactions found for this store and user",
        null
      );
    }

    const cart_details = transaction.cart_id
      .map((id) => {
        const cart = carts.find((cart) => cart.id === id);
        return cart || null;
      })
      .filter((cart) => cart !== null);

    let mergedTransaction = null;

    if (cart_details.length > 0) {
      mergedTransaction = { ...transaction.toJSON(), cart_details };
    }

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
