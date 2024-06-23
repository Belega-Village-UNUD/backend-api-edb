const { Transaction, User, DetailTransaction } = require("../../../models");
const { response } = require("../../../utils/response.utils");
const {
  checkMidtransStatus,
  updateStatusFromMidtrans,
} = require("../../../utils/midtrans.utils");
const sendEmail = require("../../../configs/nodemailer.config");
const emailTemplate = require("../../../utils/email-template.utils");
const { Op } = require("sequelize");

const payTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;

    const user = await User.findOne({ where: { id: user_id } });

    let transaction = await Transaction.findOne({
      attributes: ["id", "user_id", "status", "createdAt"],
      where: {
        id: transaction_id,
        user_id: user.id,
      },
    });

    if (!transaction || transaction.length === 0) {
      return response(res, 404, false, "No transactions found", null);
    }

    if (transaction.status == "PENDING" || transaction.status == "CANCEL") {
      return response(res, 400, false, "Transaction not valid", null);
    }

    if (transaction.status == "PAYABLE") {
      const midtrans = await checkMidtransStatus(transaction);

      const updateMidtrans = await updateStatusFromMidtrans(
        transaction.id,
        midtrans
      );

      if (updateMidtrans.status != "SUCCESS") {
        return response(res, 403, false, updateMidtrans.message, null);
      }

      transaction.status = updateMidtrans.status;
      await transaction.save();

      const template = await emailTemplate("payTransaction.template.ejs", {
        transaction_id,
      });

      await sendEmail(
        user.email,
        `Transfer Invoice - ${transaction.id}`,
        template
      );
    }

    const details = await DetailTransaction.findAll({
      where: { transaction_id: transaction.id },
    });

    return response(
      res,
      200,
      true,
      "Transaction updated successfully",
      transaction,
      details
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = payTransaction;
