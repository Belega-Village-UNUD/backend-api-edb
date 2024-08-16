const { Op } = require("sequelize");
const {
  Transaction,
  Cart,
  Product,
  User,
  Store,
  Profile,
} = require("../../../models");
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
      return response(res, 200, true, transactions.message, transactions.data);
    }

    const transactions = await getTransactionBuyerAllCustomDate(
      user.id,
      start_date,
      end_date
    );

    if (!transactions) {
      return response(res, 404, false, transactions.message, null);
    }
    return response(res, 200, true, transactions.message, transactions.data);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getAllTransactions;
