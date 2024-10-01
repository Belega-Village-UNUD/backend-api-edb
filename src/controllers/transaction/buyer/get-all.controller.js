const { Op } = require("sequelize");
const { Transaction, User, DetailTransaction } = require("../../../models");
const { response } = require("../../../utils/response.utils");
const {
  getTransactionBuyerAll,
  getTransactionBuyerAllCustomDate,
} = require("../../../utils/orm.utils");

const getAllTransactions = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { start_date, end_date } = req.query;

    const user = await User.findOne({ where: { id: user_id } });

    if (!start_date && !end_date) {
      const transactions = await getTransactionBuyerAll(user.id);

      if (!transactions || transactions.length === 0) {
        return response(res, 200, true, "No transactions found", []);
      }

      Promise.all(
        transactions.map(async (transaction) => {
          const detailTransaction = await DetailTransaction.findOne({
            where: { transaction_id: transaction.id },
            attributes: ["arrival_shipping"],
          });

          if (detailTransaction && detailTransaction.arrival_shipping) {
            return {
              ...transaction,
              arrival_shipping: detailTransaction.arrival_shipping,
            };
          }
        })
      );

      return response(
        res,
        200,
        true,
        "Transactions retrieved successfully",
        payload
      );
    }

    const transactions = await getTransactionBuyerAllCustomDate(
      user.id,
      start_date,
      end_date
    );
    if (!transactions) {
      return response(res, 404, false, transactions.message, null);
    }

    const detailTransaction = await DetailTransaction.findAll({
      where: {
        ...(user_id && { "$transaction.user_id$": user_id }),
      },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
    });
    if (!detailTransaction) {
      return response(res, 400, false, "Detail transaction not found", null);
    }

    const payload = detailTransaction.map((detail) => ({
      ...detail.toJSON(),
      arrival_shipping_status: detail.arrival_shipping_status || "PENDING",
    }));

    return response(
      res,
      200,
      true,
      "Transactions retrieved successfully",
      payload
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getAllTransactions;
