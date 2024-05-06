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
const sendEmail = require("./nodemailer.config");

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

    if (transaction.status != "CANCEL") {
      // TODO put midtrans transaction integration in here
      transaction.status = "SUCCESS";
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
