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

const getAllTransactionsAdmin = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
        },
      ],
      order: [["updatedAt", "DESC"]],
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
      },
    });

    if (!transactions || transactions.length === 0) {
      return response(res, 200, false, "No transactions found", null);
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

    let updatedTransactions = [];

    for (const transaction of mergedTransactions) {
      let updatedCarts = [];
      let arrivalShippingStatus = "UNCONFIRMED";

      const detailTransaction = await DetailTransaction.findAll({
        where: {
          transaction_id: transaction.id,
        },
        include: [
          {
            model: Transaction,
            as: "transaction",
            attributes: ["id"],
          },
        ],
        attributes: ["id", "carts_details"],
      });

      if (detailTransaction.length > 0) {
        const detailWithStatus = detailTransaction.find(
          (detail) => detail.carts_details.length
        );
        if (detailWithStatus) {
          const cartWithStatus = detailWithStatus.carts_details.find(
            (cart) => cart.arrival_shipping_status
          );
          if (cartWithStatus) {
            arrivalShippingStatus = cartWithStatus.arrival_shipping_status;
          }
        }
      }

      transaction.cart_details.forEach(async (cart) => {
        if (cart.id) {
          const newCart = {
            unit_price: cart.unit_price,
            id: cart.id,
            user_id: cart.user_id,
            product_id: cart.product_id,
            qty: cart.qty,
            arrival_shipping_status: arrivalShippingStatus,
            user: cart.user,
            product: cart.product,
          };
          updatedCarts.push(newCart);
        }
      });

      const updatedTransaction = {
        ...transaction,
        cart_details: updatedCarts,
      };
      updatedTransactions.push(updatedTransaction);
    }

    return response(
      res,
      200,
      true,
      "Transactions retrieved successfully",
      updatedTransactions
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getAllTransactionsAdmin;
