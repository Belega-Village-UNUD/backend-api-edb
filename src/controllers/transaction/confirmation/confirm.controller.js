const { nanoid } = require("nanoid");
const {
  Cart,
  User,
  Product,
  Transaction,
  Profile,
  Store,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");
const { Op } = require("sequelize");
const {
  MIDTRANS_SERVER_KEY,
  MIDTRANS_APP_URL,
  FE_URL,
} = require("../../../utils/constan");

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

    const cartIds = transaction.cart_id;

    const carts = await Cart.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            {
              model: Profile,
              as: "userProfile",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          model: Product,
          as: "product",
          include: [
            {
              model: Store,
              as: "store",
              attributes: ["id", "name"],
              include: [
                {
                  model: User,
                  as: "user",
                  attributes: ["id", "email"],
                  include: [
                    {
                      model: Profile,
                      as: "userProfile",
                      attributes: ["id", "name"],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: {
        id: { [Op.in]: cartIds },
        "$product.store_id$": storeUserId.id,
      },
    });

    if (!transaction) {
      return response(res, 404, false, "Transaction not found", null);
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

    const customerDetails = await Profile.findOne({
      attributes: ["name", "phone"],
      where: { user_id: transaction.user_id },
      include: [{ model: User, as: "user", attributes: ["email"] }],
    });

    const payload = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.total_amount,
      },
      item_details: itemDetails,
      customer_details: {
        first_name: customerDetails.name,
        email: customerDetails.user.email,
        phone: customerDetails.phone,
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
        body: JSON.stringify(payload),
      }
    );

    const data = await responsedMidtrans.json();

    if (responsedMidtrans.status !== 201) {
      return response(
        res,
        responsedMidtrans.status,
        false,
        "Failed to create transaction",
        null
      );
    }

    transaction.token = data.token;
    transaction.redirect_url = data.redirect_url;
    transaction.status = "PAYABLE";
    await transaction.save();

    return response(res, 200, true, "Transaction confirmed", 1);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = confirm;
