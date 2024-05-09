const Sequelize = require("sequelize");
const { nanoid } = require("nanoid");
const {
  Transaction,
  Cart,
  Product,
  User,
  Store,
  Profile,
  DetailTransaction,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");
// const sendEmail = require("./nodemailer.config");
const crypto = require("crypto");
const { MIDTRANS_SERVER_KEY } = require("../../../utils/constan");

const updateStatusFromMidtrans = async (transaction_id, data) => {
  const hash = crypto
    .createHash("sha512")
    .update(
      `${transaction_id}${data.status_code}${data.gross_amount}${MIDTRANS_SERVER_KEY}`
    )
    .digest("hex");

  if (data.signature_key !== hash) {
    return response(res, 400, false, "Signature key is not match", null);
  }

  // let responseData = null;
  let transactionStatus = data.transaction_status;
  let fraudStatus = data.fraud_status;

  if (transactionStatus == "capture") {
    if (fraudStatus == "accept") {
      let status = { status: "SUCCESS" };
      return status;
    }
  }
};

const payTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;

    const user = await User.findOne({ where: { id: user_id } });

    let transaction = await Transaction.findOne({
      attributes: ["id", "user_id", "status", "createdAt"],
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
        },
      ],
      where: {
        "$cart.user.id$": user.id,
        id: transaction_id,
      },
    });

    if (!transaction || transaction.length === 0) {
      return response(
        res,
        200,
        false,
        "No transactions found for this user",
        null
      );
    }

    if (transaction.status == "PENDING" || transaction.status == "CANCEL") {
      return response(res, 200, false, "Transaction not valid", null);
    }

    if (transaction.status == "PAYABLE") {
      const midtrans = await updateStatusFromMidtrans(
        transaction.id,
        transaction_id
      );
      transaction.status = midtrans.status;
      await transaction.save();
      // TODO create notification here to seller
      const notification = {
        title: "Transfer Success",
        message: `You have a new order from ${transaction.cart.user.userProfile.name} for product ${transaction.cart.product.name_product} with total price ${transaction.total_price}`,
        transction_id: transaction.id,
        type: "order",
        user_id: transaction.cart.product.store.user.id,
      };

      // TODO Email Notification
      // await sendEmail(user.email, subject, template);

      const detailTransaction = await DetailTransaction.findOne({
        where: {
          transaction_id: transaction.id,
        },
      });

      if (!detailTransaction) {
        await DetailTransaction.create({
          id: nanoid(10),
          transaction_id: transaction.id,
          product_id: transaction.cart.product_id,
          qty: transaction.cart.qty,
          unit_price: transaction.cart.unit_price,
          total_price: transaction.cart.qty * transaction.total_price,
          recipient_link: "https://www.google.com",
        });
      }
    }

    return response(
      res,
      200,
      true,
      "Transaction updated successfully",
      transaction
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = payTransaction;
