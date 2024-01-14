const Midtrans = require("midtrans-client");
const { response } = require("../../utils/response.utils");

const getTokenMidtrans = async (req, res) => {
  try {
    let snap = new Midtrans.Snap({
      isProduction: false,
      serverKey: process.env.MIDTRANS_SERVER_KEY,
      clientKey: process.env.MIDTRANS_CLIENT_KEY,
    });

    const { id, productName, price, quantity } = req.body;

    let parameter = {
      item_details: {
        name: productName,
        price: price,
        quantity: quantity,
      },
      transaction_details: {
        order_id: id,
        gross_amount: price * quantity,
      },
    };

    const token = await snap.createTransactionToken(parameter);
    return response(res, 201, true, "Get Token is Success", { token });
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getTokenMidtrans;
