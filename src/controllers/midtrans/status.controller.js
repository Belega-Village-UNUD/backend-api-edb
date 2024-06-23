require("dotenv").config();
const { response } = require("../../utils/response.utils");
const { getDetailTransaction } = require("../../utils/orm.utils");
const { modifyStatusTransaction } = require("../../utils/midtrans.utils");

const checkStatus = async (req, res) => {
  try {
    const { order_id: transaction_id, transaction_status } = req.query;

    const detailTransaction = await getDetailTransaction(transaction_id);

    if (!detailTransaction) {
      return response(res, 404, false, "No transactions found", null);
    }

    await modifyStatusTransaction(transaction_id, transaction_status);

    return response(
      res,
      200,
      true,
      "Successfully get Error Status from Midtrans",
      detailTransaction
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = checkStatus;
