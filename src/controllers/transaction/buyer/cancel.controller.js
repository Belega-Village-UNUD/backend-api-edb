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
      where: {
        id: transaction_id,
        status: { [Op.notIn]: ["CANCEL", "SUCCESS"] }, //  NOTE: Filter all Cancel and Success transaction
      },
    });

    if (!transaction) {
      return response(
        res,
        400,
        false,
        "Cannot Cancel Transaction",
        null
      );
    }

    let carts = await Cart.findAll({
      where: {
        id: { [Op.in]: transaction.cart_id },
      },
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

    transaction.status = "CANCEL";
    await transaction.save();

    const cancelledTransaction = await CancelledTransaction.findOne({
      where: {
        transaction_id: transaction.id,
      },
      include: [{ model: Transaction, as: "transaction" }],
    });

    if (!cancelledTransaction) {
      // count the sum product by checking all the carts qty
      let quantity = 0;
      let unitPrice = 0;

      for (const cart of carts) {
        quantity += cart.qty;
        unitPrice += cart.unit_price;

        // TODO create notification here to seller
        const notification = {
          title: "Order Cancelled",
          message: `Order with ID ${transaction.id} has been cancelled by ${cart.user.email}`,
          transaction: transaction.id,
          type: "order",
          store_id: cart.product.store.user.id,
        };
      }

      await CancelledTransaction.create({
        id: nanoid(10),
        transaction_id: transaction.id,
        sum_product: quantity,
        total_price: quantity * unitPrice,
        reason: reason,
      });

      // TODO Email Notification for seller
      const template = await emailTemplate("cancelTransaction.template.ejs", {
        transaction,
        carts,
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
