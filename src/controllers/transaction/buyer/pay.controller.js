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
const {
  checkMidtransStatus,
  updateStatusFromMidtrans,
} = require("../../../utils/midtrans.utils");
const sendEmail = require("../../../configs/nodemailer.config");
const emailTemplate = require("../../../utils/email-template.utils");
const { Op } = require("sequelize");

const payTransaction = async (req, res) => {
  try {
    const { id: user_id } = req.user;
    const { id: transaction_id } = req.params;

    const user = await User.findOne({ where: { id: user_id } });

    let transaction = await Transaction.findOne({
      attributes: ["id", "user_id", "status", "createdAt"],
      where: {
        id: transaction_id,
        user_id: user.id,
      },
    });

    if (!transaction || transaction.length === 0) {
      return response(res, 404, false, "No transactions found", null);
    }

    if (transaction.status == "PENDING" || transaction.status == "CANCEL") {
      return response(res, 400, false, "Transaction not valid", null);
    }

    if (transaction.status == "PAYABLE") {
      const midtrans = await checkMidtransStatus(transaction);

      const updateMidtrans = await updateStatusFromMidtrans(
        transaction.id,
        midtrans
      );

      if (updateMidtrans.status != "SUCCESS") {
        return response(res, 403, false, updateMidtrans.message, null);
      }

      transaction.status = updateMidtrans.status;
      await transaction.save();

      // const cartIds = transaction.cart_id;

      // const carts = await Cart.findAll({
      //   include: [
      //     {
      //       model: User,
      //       as: "user",
      //       attributes: ["id", "email"],
      //       include: [
      //         {
      //           model: Profile,
      //           as: "userProfile",
      //           attributes: ["id", "name"],
      //         },
      //       ],
      //     },
      //     {
      //       model: Product,
      //       as: "product",
      //       include: [
      //         {
      //           model: Store,
      //           as: "store",
      //           attributes: ["id", "name"],
      //           include: [
      //             {
      //               model: User,
      //               as: "user",
      //               attributes: ["id", "email"],
      //               include: [
      //                 {
      //                   model: Profile,
      //                   as: "userProfile",
      //                   attributes: ["id", "name"],
      //                 },
      //               ],
      //             },
      //           ],
      //         },
      //       ],
      //     },
      //   ],
      //   where: {
      //     id: { [Op.in]: cartIds },
      //     user_id: user.id,
      //   },
      // });

      // // TODO create notifi cation  here to seller
      // carts.map((cart) => {
      //   notifications.push({
      //     title: "Transfer Success",
      //     message: `You have a new order from ${cart.user.userProfile.name} for pr  oduct   ${cart.product.name_product} with total price ${transaction.total_price}`,
      //     transaction_id: transaction.id,
      //     type: "order",
      //     user_id: transaction.cart.product.store.user.id,
      //   });
      // });

      // // };

      const template = await emailTemplate("payTransaction.template.ejs", {
        transaction_id,
      });

      await sendEmail(
        user.email,
        `Transfer Invoice - ${transaction.id}`,
        template
      );

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
          total_price: transaction.cart.qty * transaction.cart.unit_price,
          recipient_link: "", // TODO create the receipt link for the template by upload image first and return the link
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
    console.error(error);
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = payTransaction;
