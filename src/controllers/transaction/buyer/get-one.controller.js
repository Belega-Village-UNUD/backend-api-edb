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

const getOneTransactions = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;

    const user = await User.findOne({ where: { id: user_id } });

    const transaction = await Transaction.findOne({
      where: {
        user_id: user.id,
        id: transaction_id,
      },
    });

    if (!transaction || transaction.length === 0) {
      return response(
        res,
        200,
        false,
        "No transactions found for this user",
        null
      );
    }

    // Fetch the carts
    const carts = await Cart.findAll({
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
      where: {
        id: { [Sequelize.Op.in]: transaction.cart_id },
      },
    });
    console.log("🚀 ~ getAllTransactions ~ carts:", carts);

    // Merge the cart details into the transactions
    const cart_details = transaction.cart_id.map((id) => {
      const cart = carts.find((cart) => cart.id === id);
      return cart || id;
    });

    const mergedTransaction = { ...transaction.toJSON(), cart_details };

    return response(
      res,
      200,
      true,
      "Transaction retrieved successfully",
      mergedTransaction
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getOneTransactions;
