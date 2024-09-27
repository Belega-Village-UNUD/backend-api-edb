const { DetailTransaction, Transaction, User } = require("../../../models");
const { getDetailTransaction } = require("../../../utils/orm.utils");
const { response } = require("../../../utils/response.utils");

const getCheckShipping = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;

    const user = await User.findOne({ where: { id: user_id } });
    const transaction = await Transaction.findOne({
      where: { id: transaction_id, user_id: user.id },
    });
    if (!transaction) {
      return response(res, 404, false, "Transaction not found", null);
    }

    const detailTransaction = await getDetailTransaction(
      transaction.id,
      user_id
    );
    if (!detailTransaction) {
      return response(res, 400, false, "Detail transaction not found", null);
    }

    return response(
      res,
      200,
      true,
      "Check shipping success",
      detailTransaction
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = getCheckShipping;
