const { nanoid } = require("nanoid");
const { Cart, User, Product, Transaction, Store } = require("../../models");
const { response } = require("../../utils/response.utils");
const { Op } = require("sequelize");

const addItem = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    const products = req.body;
    const transactions = await Transaction.findAll({
      where: {
        user_id: user.id,
      },
      attributes: ["id", "cart_id"],
      raw: true,
    });

    for (let i = 0; i < products.length; i++) {
      const { product_id, qty } = products[i];

      const store = await Store.findOne({
        where: { user_id: user.id },
        attributes: ["id"],
      });
      console.log("🚀 ~ addItem ~ store:", store);

      // check if the product is not from the user store (to prevent buy product from itself)
      const product = await Product.findOne({
        where: { id: product_id, store_id: { [Op.not]: store.id } },
        attributes: ["id", "price", "stock", "name_product"],
      });
      console.log("🚀 ~ addItem ~ product:", product);
      if (!product) {
        return response(
          res,
          403,
          false,
          "You cannot order from your own store",
          product
        );
      }

      if (qty === 0) {
        return response(
          res,
          400,
          false,
          `Minimum quantity for ${product.name_product} is 1`,
          null
        );
      }

      const existingCartItem = await Cart.findOne({
        where: {
          id: {
            [Op.notIn]: transactions.map((transaction) => transaction.cart_id),
          },
          user_id: user.id,
          product_id: product.id,
        },
      });

      if (existingCartItem) {
        if (existingCartItem.qty + qty > product.stock) {
          return response(
            res,
            400,
            false,
            `Insufficient stock for ${product.name_product}`,
            null
          );
        }
        await existingCartItem.update({
          qty: existingCartItem.qty + qty,
        });
      } else {
        await Cart.create({
          id: nanoid(10),
          user_id: user.id,
          product_id,
          qty,
          unit_price: product.price,
        });
      }
    }

    const cart = await Cart.findAll({
      where: {
        id: {
          [Op.notIn]: transactions.map((transaction) => transaction.cart_id),
        },
        user_id: user.id,
      },
    });

    return response(res, 201, true, "Cart item added", cart);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = addItem;
