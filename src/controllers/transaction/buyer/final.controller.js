const { nanoid } = require("nanoid");
const {
  Transaction,
  DetailTransaction,
  User,
  Profile,
} = require("../../../models");
const { Op } = require("sequelize");
const { mergeTransactionData } = require("../../../utils/merge-tx-data");
const { getCarts, getDetailTransaction } = require("../../../utils/orm.utils");
const { response } = require("../../../utils/response.utils");
const {
  countTotalTransactionAfterShipping,
  cartDetailsWithShippingCost,
} = require("../../../utils/shipping.utils");

const finalTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    let { transaction_id, shipping_name, shipping_cost_index } = req.query;

    const detail = (await getDetailTransaction(transaction_id, user_id))
      ? true
      : false;
    if (!detail) {
      shipping_name = JSON.parse(shipping_name);
      shipping_cost_index = JSON.parse(shipping_cost_index);

      const user = await User.findOne({
        where: { id: user_id },
        attributes: ["id"],
        include: [
          { model: Profile, as: "userProfile", attributes: ["id", "city"] },
        ],
      });

      let transaction = await Transaction.findOne({
        where: {
          id: transaction_id,
          user_id: user.id,
        },
      });

      if (!transaction || transaction.length === 0) {
        return response(res, 404, false, "No transactions found", null);
      }

      const checkTransactionStatus =
        transaction.status == "PENDING" ? true : false;

      if (!checkTransactionStatus) {
        return response(res, 400, false, "Transaction not valid", null);
      }

      const cartIds = transaction.cart_id;
      const carts = await getCarts(cartIds);
      const transactionsData = mergeTransactionData(carts);

      let cartDetails = [];
      try {
        cartDetails = await cartDetailsWithShippingCost(
          user,
          transactionsData,
          shipping_name,
          shipping_cost_index
        );
      } catch (error) {
        return response(res, error.status || 400, false, error.message, null);
      }

      const totalValue = countTotalTransactionAfterShipping(cartDetails);

      const payload = {
        id: nanoid(10),
        transaction_id: transaction.id,
        carts_details: cartDetails,
        sub_total_transaction_price_before_shipping: transaction.total_amount,
        sub_total_shipping: totalValue.subTotalShipping,
        total_final_price: totalValue.totalFinalPrice,
        receipt_link: "", // TODO create the receipt link for the template by upload image first and return the link
      };

      transaction.total_amount = payload.total_final_price;

      await DetailTransaction.create({
        id: payload.id,
        transaction_id: payload.transaction_id,
        carts_details: payload.carts_details,
        sub_total_transaction_price_before_shipping:
          payload.sub_total_transaction_price_before_shipping,
        sub_total_shipping: payload.sub_total_shipping,
        total_final_price: payload.total_final_price,
        receipt_link: payload.receipt_link,
      });

      transaction.save();

      return response(
        res,
        200,
        true,
        "Transaction with Detail updated successfully",
        payload
      );
    }

    return response(res, 400, false, "Please pay this transaction", detail);
  } catch (error) {
    console.error(error);
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = finalTransaction;
