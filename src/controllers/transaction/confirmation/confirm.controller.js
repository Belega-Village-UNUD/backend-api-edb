const {
  User,
  Transaction,
  Store,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");

const confirm = async (req, res) => {
  try {
    const { id: transactionId } = req.params;
    const { id } = req.user;

    const storeUserId = await Store.findOne({
      attributes: ["id", "user_id"],
      where: { user_id: id },
    });

    if (!storeUserId) {
      return response(
        res,
        404,
        false,
        "You are not a store for this transaction",
        null
      );
    }

    let transaction = await Transaction.findOne({
      include: [
        {
          model: User,
          as: "user",
        },
      ],
      where: { id: transactionId },
    });

    if (!transaction) {
      return response(
        res,
        404,
        false,
        "Transaction not found because you are not the seller of this transaction",
        null
      );
    }

    if (transaction.status !== "PENDING") {
      return response(
        res,
        400,
        false,
        "Only pending transactions can be confirmed",
        null
      );
    }

    transaction.status = "PAYABLE";
    await transaction.save();

    return response(res, 200, true, "Transaction confirmed", 1);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = confirm;
