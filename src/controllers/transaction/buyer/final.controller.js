const { nanoid } = require("nanoid");
const {
  Transaction,
  DetailTransaction,
  User,
  Profile,
} = require("../../../models");
const { Op } = require("sequelize");
const { mergeTransactionData } = require("../../../utils/merge.utils");
const {
  getCarts,
  getDetailTransaction,
  getOneTransaction,
} = require("../../../utils/orm.utils");
const { response } = require("../../../utils/response.utils");
const {
  countTotalTransactionAfterShipping,
  cartDetailsWithShippingCost,
} = require("../../../utils/shipping.utils");
const {
  MIDTRANS_SERVER_KEY,
  MIDTRANS_APP_URL,
  FE_URL,
} = require("../../../utils/constan");

const finalTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    let { transaction_id, shipping_name, shipping_cost_index } = req.query;

    let transaction = await getOneTransaction(transaction_id);
    if (transaction.status != "PAYABLE") {
      return response(
        res,
        400,
        false,
        "Transaction not valid, please wait status to be PAYABLE",
        null,
      );
    }

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
        transaction.status == "PENDING" || "PAYABLE" ? true : false;

      if (!checkTransactionStatus) {
        return response(res, 400, false, "Transaction not valid", null);
      }

      const cartIds = transaction.cart_id;
      const carts = await getCarts(cartIds);
      const transactionsData = mergeTransactionData(carts);

      let cartDetails;

      try {
        cartDetails = await cartDetailsWithShippingCost(
          user,
          transactionsData,
          shipping_name,
          shipping_cost_index,
        );
      } catch (error) {
        console.error(error);
        return response(
          res,
          error.status || 400,
          false,
          "Failed to perform counting detail shipping detail",
          null,
        );
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

      const authString = btoa(`${MIDTRANS_SERVER_KEY}:`);

      let itemDetails = [];

      carts.map((cart) => {
        itemDetails.push({
          id: cart.product.id,
          price: cart.product.price,
          quantity: cart.qty,
          name: cart.product.name_product,
        });
      });

      cartDetails.map((cart) => {
        itemDetails.push({
          id: nanoid(10),
          price: cart.shipping.costs,
          quantity: 1,
          name: "shipping-" + cart.shipping.code,
        });
      });

      const customerDetails = await Profile.findOne({
        where: { user_id: transaction.user_id },
        include: [{ model: User, as: "user", attributes: ["email"] }],
      });

      const payloadMidtrans = {
        transaction_details: {
          order_id: transaction.id,
          gross_amount: transaction.total_amount,
        },
        item_details: itemDetails,
        customer_details: {
          first_name: customerDetails.name,
          email: customerDetails.user.email,
          phone: customerDetails.phone,
          billing_address: {
            first_name: customerDetails.name,
            email: customerDetails.user.email,
            phone: customerDetails.phone,
            address: customerDetails.address,
            city: customerDetails.city.city_name,
            postal_code: customerDetails.city.postal_code,
          },
          shipping_address: {
            first_name: customerDetails.name,
            email: customerDetails.user.email,
            phone: customerDetails.phone,
            address: customerDetails.address,
            city: customerDetails.city.city_name,
            postal_code: customerDetails.city.postal_code,
          },
        },
      };

      const responsedMidtrans = await fetch(
        `${MIDTRANS_APP_URL}/snap/v1/transactions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
            Authorization: `Basic ${authString}`,
          },
          body: JSON.stringify(payloadMidtrans),
        },
      );

      const data = await responsedMidtrans.json();

      if (responsedMidtrans.status !== 201) {
        return response(
          res,
          responsedMidtrans.status,
          false,
          "Failed to create transaction",
          null,
        );
      }

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

      transaction.token = data.token;
      transaction.redirect_url = data.redirect_url;
      transaction.save();

      return response(
        res,
        200,
        true,
        "Transaction with Detail updated successfully",
        {
          cartDetail: cartDetails,
          redirect_url: data.redirect_url,
          token_midtrans: data.token,
          payload,
        },
      );
    }

    return response(
      res,
      400,
      false,
      "Request invalid please check your transaction status",
      detail,
    );
  } catch (error) {
    console.error(error);
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = finalTransaction;
