const Sequelize = require("sequelize");
const {
  Transaction,
  Cart,
  Product,
  User,
  Store,
  Profile,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");

const getAllTransactions = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const user = await User.findOne({ where: { id: user_id } });

    const transactions = await Transaction.findAll({
      attributes: ["id", "user_id", "status", "createdAt"],
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
        "$cart.user.id$": user.id,
      },
    });

    if (!transactions || transactions.length === 0) {
      return response(
        res,
        200,
        false,
        "No transactions found for this user",
        null
      );
    }

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
