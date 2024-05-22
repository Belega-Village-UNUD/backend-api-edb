const { nanoid } = require("nanoid");
const {
  Transaction,
  Cart,
  Product,
  User,
  Store,
  Profile,
  CancelledTransaction,
} = require("../../../models");
const { response } = require("../../../utils/response.utils");
const sendEmail = require("../../../configs/nodemailer.config");
const emailTemplate = require("../../../utils/email-template.utils");
const { Op } = require("sequelize");

const cancelTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;
    const { reason } = req.body;

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
        status: { [Op.notIn]: ["CANCEL", "SUCCESS"] }, //  NOTE: Filter all Cancel and Success transaction
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

    // TODO create notification here to seller
    const notification = {
      title: "Order Cancelled",
      message: `Order with ID ${transaction.id} has been cancelled by ${transaction.cart.user.email}`,
      transaction: transaction.id,
      type: "order",
      store_id: transaction.cart.product.store.user.id,
    };

    transaction.status = "CANCEL";
    await transaction.save();

    const cancelledTransaction = await CancelledTransaction.findOne({
      where: {
        transaction_id: transaction.id,
      },
      include: [{ model: Transaction, as: "transaction" }],
    });

    if (!cancelledTransaction) {
      await CancelledTransaction.create({
        id: nanoid(10),
        transaction_id: transaction.id,
        sum_product: transaction.cart.qty,
        total_price: transaction.cart.qty * transaction.cart.unit_price,
        reason: reason,
      });

      // TODO Email Notification for seller
      const template = await emailTemplate("cancelTransaction.template.ejs", {
        transaction,
        reason,
      });

      await sendEmail(user.email, `Cancel Order - ${transaction.id}`, template);
    }

    return response(
      res,
      200,
      true,
      "Transaction cancelled successfully, please check your email",
      transaction
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = cancelTransaction;
