const { Cart, User, Product, Store, Transaction } = require("../../models");
const { response } = require("../../utils/response.utils");
const { Op } = require("sequelize");

const getItems = async (req, res) => {
  try {
    const { id } = req.user;

    // get the user
    const user = await User.findOne({
      where: {
        id: id,
      },
      attributes: ["id"],
    });

    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    // get all the cart id the has been in transactions
    const transactions = await Transaction.findAll({
      where: {
        user_id: user.id,
      },
      attributes: ["id", "cart_id"],
      raw: true,
    });

    const transcationsCartIds = transactions.map(
      (transaction) => transaction.cart_id
    );

    // filter cart that has not been in the transaction module
    const cartItems = await Cart.findAll({
      where: {
        id: {
          [Op.notIn]: transcationsCartIds,
        },

        is_checkout: { [Op.not]: true },
        user_id: id,
      },
      include: [
        {
          model: Product,
          as: "product",
          attributes: [
            "id",
            "image_product",
            "name_product",
            "price",
            "stock",
            "desc_product",
            "type_id",
          ],
          include: {
            model: Store,
            as: "store",
            attributes: ["id", "name", "phone", "address", "description"],
          },
        },
      ],
    });

    const stores = {};

    cartItems.forEach((cartItem) => {
      // break the loop if there's no product
      if (!cartItem.product) {
        return;
      }

      // If the store doesn't exist in the object yet, create it
      if (!stores[cartItem.product.store.id]) {
        stores[cartItem.product.store.id] = {
          store: {
            id: cartItem.product.store.id,
            name: cartItem.product.store.name,
            phone: cartItem.product.store.phone,
            address: cartItem.product.store.address,
            description: cartItem.product.store.description,
          },
          carts: [],
        };
      }
      // Add the product to the store's products array
      stores[cartItem.product.store.id].carts.push({
        id: cartItem.id,
        qty: cartItem.qty,
        product_id: cartItem.product.id,
        image_product: cartItem.product.image_product,
        name_product: cartItem.product.name_product,
        price: cartItem.product.price,
        stock: cartItem.product.stock,
        desc_product: cartItem.product.desc_product,
        is_checkout: cartItem.is_checkout,
        type_id: cartItem.product.type_id,
      });
    });

    // convert object to array
    const data = Object.values(stores);

    return response(res, 200, true, "Cart items fetched", data);
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getItems;
