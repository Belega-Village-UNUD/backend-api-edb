const { Transaction } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const decline = async (req, res) => {
  try {
    const { transactionId } = req.params;

    const transaction = await Transaction.findOne({
      where: { id: transactionId },
    });
    if (!transaction) {
      return response(res, 404, false, "Transaction not found", null);
    }

    if (transaction.status !== "PENDING") {
      return response(
        res,
        400,
        false,
        "Only pending transactions can be declined",
        null
      );
    }

    transaction.status = "CANCEL";
    await transaction.save();

    return response(res, 200, true, "Transaction declined", transaction);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = decline;
