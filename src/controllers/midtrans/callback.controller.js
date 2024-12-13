const { modifyStatusTransaction } = require("../../utils/midtrans.utils");
const { response } = require("../../utils/response.utils");
const crypto = require("crypto");
const { MIDTRANS_SERVER_KEY } = require("../../utils/constan");
const { changeAllShippingStatus } = require("../../utils/shipping.utils");

const handleMidtransWebhook = async (req, res) => {
  try {
    const { order_id, status_code, gross_amount, transaction_status } =
      req.body;

    const expectedSignature = crypto
      .createHmac("sha512", MIDTRANS_SERVER_KEY)
      .update(`${order_id}${status_code}${gross_amount}${MIDTRANS_SERVER_KEY}`)
      .digest("hex");

    if (!expectedSignature) {
      return response(res, 403, false, "Invalid signature", null);
    }

    const updateStatus = await modifyStatusTransaction(
      order_id,
      transaction_status
    );

    if (!updateStatus) {
      return response(res, 404, false, "Transaction not found", null);
    }

    const shipping_status = await changeAllShippingStatus(order_id, "PACKING");

    if (!shipping_status) {
      throw "error on updating shipping status";
    }

    return response(res, 200, true, "Webhook handled successfully", null);
  } catch (error) {
    console.error("line 38", error);
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = handleMidtransWebhook;
