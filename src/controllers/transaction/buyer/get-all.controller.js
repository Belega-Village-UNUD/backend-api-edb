const { Op } = require("sequelize");
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
const {
  getTransactionBuyerAll,
  getTransactionBuyerAllCustomDate,
} = require("../../../utils/orm.utils");

const getAllBuyerTransactionHistory = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { start_date, end_date } = req.query;

    const user = await User.findOne({ where: { id: user_id } });

    let transactions;
    if (start_date && end_date) {
      transactions = await getTransactionBuyerAllCustomDate(
        user.id,
        start_date,
        end_date
      );
    } else {
      transactions = await getTransactionBuyerAll(user.id);
    }

    let updatedTransactions = [];

    for (const transaction of transactions.data) {
      let updatedCarts = [];
      let arrivalShippingStatus = "UNCONFIRMED";

      const detailTransaction = await DetailTransaction.findAll({
        where: {
          transaction_id: transaction.id,
          "$transaction.user_id$": user.id,
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

    return response(res, 200, true, transactions.message, updatedTransactions);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getAllBuyerTransactionHistory;
