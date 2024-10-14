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
    let cart = null;
    let carts = [];

    for (let i = 0; i < products.length; i++) {
      const { product_id, qty } = products[i];

      const store = await Store.findOne({
        where: { user_id: user.id },
        attributes: ["id", "user_id"],
      });

      const product = await Product.findOne({
        where: { id: product_id, display: true },
        attributes: ["id", "price", "stock", "name_product"],
        include: [
          {
            model: Store,
            as: "store",
            attributes: ["id", "user_id", "is_verified"],
          },
        ],
      });

      if (!product) {
        return response(res, 404, false, `Product not found`, null);
      }

      const storeIsnull = store === null ? true : false;

      if (!storeIsnull) {
        // check if the product is not from the user store (to prevent buy product from itself)
        const checkStore = store.id === product.store.id ? true : false;
        if (checkStore) {
          return response(
            res,
            403,
            false,
            `You cannot buy from your own store`,
            null
          );
        }
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
          is_checkout: false,
        });
        carts.push(existingCartItem);
      } else {
        cart = await Cart.create({
          id: nanoid(10),
          user_id: user.id,
          product_id,
          qty,
          unit_price: product.price,
          is_checkout: false,
        });
        carts.push(cart);
      }
    }

    return response(res, 201, true, "Cart item added", carts);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = addItem;
