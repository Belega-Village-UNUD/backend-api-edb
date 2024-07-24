const { response } = require("../../../utils/response.utils");
const { changeShippingStatus } = require("../../../utils/shipping.utils");
const { getOneTransaction } = require("../../../utils/orm.utils");
const { updateBalance } = require("../../../utils/balance.utils");

const arrived = async (req, res) => {
  try {
    const { product_id, transaction_id } = req.body;

    if (!product_id || !transaction_id) {
      return response(res, 400, false, "Invalid request", null);
    }

    const transaction = await getOneTransaction(transaction_id);

    if (!transaction) {
      return response(res, 404, false, "Transaction not found", null);
    }

    if (transaction.status != "SUCCESS") {
      return response(res, 404, false, "Cannot send this product", null);
    }

    const data = await changeShippingStatus(
      product_id,
      transaction_id,
      "ARRIVED"
    );

    if (!data.success) {
      return response(res, 404, data.success, data.message, null);
    }

    const balance = await updateBalance(transaction_id, product_id);

    if (!balance.success) {
      return response(res, 404, balance.success, balance.message, null);
    }

    return response(res, 200, true, "Product has Arrived", data);
  } catch (error) {
    return response(res, 500, false, error.message, null);
  }
};

module.exports = arrived;
