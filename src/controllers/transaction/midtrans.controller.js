const Midtrans = require("midtrans-client");
const { User } = require("../../models");
const { response } = require("../../utils/response.utils");

const getTokenMidtrans = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await User.findOne({
      where: { email: email },
      attributes: { exclude: ["password"] },
    });

    if (!user) return response(res, 404, false, "User not found", null);

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

    const midtrans_token = await snap.createTransactionToken(parameter);
    console.log("🚀 ~ getTokenMidtrans ~ midtrans_token:", midtrans_token)
    return response(res, 201, true, "Get Token is Success", { midtrans_token });
  } catch (error) {
    console.log("🚀 ~ getTokenMidtrans ~ error:", error)
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getTokenMidtrans;
