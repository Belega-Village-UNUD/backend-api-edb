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
      attributes: ["user_id"],
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
      attributes: ["id", "user_id", "total_amount", "status", "createdAt"],
      include: [
        {
          model: Cart,
          as: "cart",
          attributes: ["id", "user_id", "product_id", "qty", "unit_price"],
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email"],
              include: [
                {
                  model: Profile,
                  as: "userProfile",
                  attributes: ["name", "phone"],
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
                  include: [
                    {
                      model: User,
                      as: "user",
                      include: [{ model: Profile, as: "userProfile" }],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
      where: {
        "$cart.product.store.user.id$": storeUserId.user_id,
        id: transactionId,
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

    const payload = {
      transaction_details: {
        order_id: transaction.id,
        gross_amount: transaction.total_amount,
      },
      item_details: [
        {
          id: transaction.cart.product.id,
          price: transaction.cart.product.price,
          quantity: transaction.cart.qty,
          name: transaction.cart.product.name_product,
        },
      ],
      customer_details: {
        first_name: transaction.cart.user.userProfile.name,
        email: transaction.cart.user.email,
        phone: transaction.cart.user.userProfile.phone,
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

    return response(res, 200, true, "Transaction confirmed", transaction);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = confirm;
