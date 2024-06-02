const {
  Transaction,
  Cart,
  Product,
  User,
  Store,
  Profile,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { checkMidtransStatus } = require("../../../utils/midtrans.utils");

/**
 *
 * @param {*} req
 * @param {*} res
 * @returns
 */
const getAllTransactions = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const store = await Store.findOne({ where: { user_id } });

    if (!store) return response(res, 404, false, "Store not found", null);

    const transactions = await Transaction.findAll({
      include: [
        {
          model: Cart,
          as: "cart",
          attributes: ["id", "user_id", "product_id", "qty", "unit_price"],
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
        },
      ],
      where: {
        "$cart.product.store_id$": store.id,
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

    // await checkMidtransStatus(transactions);

    return response(
      res,
      200,
      true,
      "Transactions retrieved successfully",
      transactions
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getAllTransactions;
