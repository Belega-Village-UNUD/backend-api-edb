const { response } = require("../../../utils/response.utils");
const { changeShippingStatus } = require("../../../utils/shipping.utils");
const { getOneTransaction } = require("../../../utils/orm.utils");
const { updateBalance } = require("../../../utils/balance.utils");
const { nanoid } = require("nanoid");
const { Invoice, DetailTransaction, Transaction } = require("../../../models");

const arrived = async (req, res) => {
  try {
    const { store_id, transaction_id } = req.body;
    if (!store_id || !transaction_id) {
      return response(res, 400, false, "Invalid request", null);
    }

    const transaction = await getOneTransaction(transaction_id);
    if (!transaction) {
      return response(res, 404, false, "Transaction not found", null);
    }

    if (transaction.status != "SUCCESS") {
      return response(res, 404, false, "Cannot accept this product", null);
    }

    const data = await changeShippingStatus(
      store_id,
      transaction_id,
      "ARRIVED"
    );
    if (!data.success) {
      return response(res, 404, data.success, data.message, null);
    }

    const balance = await updateBalance(transaction_id, store_id);
    if (!balance.success) {
      return response(res, 404, balance.success, balance.message, null);
    }

    const detailTransaction = await DetailTransaction.findOne({
      where: { transaction_id },
      include: [
        {
          model: Transaction,
          as: "transaction",
        },
      ],
    });

    const cartDetailStore = detailTransaction.carts_details.filter(
      (cartDetail) => cartDetail.store_id == store_id
    );
    const shippingMethod = `${
      cartDetailStore[0].shipping.code.charAt(0).toUpperCase() +
      cartDetailStore[0].shipping.code.slice(1)
    } ${cartDetailStore[0].shipping.service} (${
      cartDetailStore[0].shipping.description
    })`;

    await Invoice.create({
      id: `INV-${nanoid(5)}-${nanoid(5)}`,
      detail_transaction_id: detailTransaction.id,
      store_id: cartDetailStore[0].store_id,
      shipping_method: shippingMethod,
      shipping_price: cartDetailStore[0].shipping.costs,
      total_price:
        cartDetailStore[0].shipping.costs +
        cartDetailStore[0].sub_total_cart_price,
    });

    return response(res, 200, true, "Product has Arrived", data);
  } catch (error) {
    return response(res, 500, false, error.message, null);
  }
};

module.exports = arrived;
