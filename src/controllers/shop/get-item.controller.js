const { Cart, User, Product, Store, Transaction } = require("../../models");
const { response } = require("../../utils/response.utils");
const { Op, ENUM, sequelize } = require("sequelize");

const getItems = async (req, res) => {
  try {
    const { id } = req.user;
    // check all Carts from this users to get the id of cart
    const allCarts = await Cart.findAll({
      where: { user_id: id },
      attributes: ["id"],
    });

    //console.log(`allCarts is array? ${Array.isArray(allCarts)}`); // Corrected this line

    const checkoutedCarts = allCarts.map((cart) => cart.id);
    console.log("🚀 ~ getItems ~ checkoutedCarts:", checkoutedCarts);

    // check the transactions
    const transactions = await Transaction.findAll({
      where: {
        cart_id: { [Op.in]: checkoutedCarts },
        user_id: id,
      },
    });

    let listCarts = [];
    transactions.map((transaction) => listCarts.push(transaction.cart_id));
    console.log("🚀 ~ getItems ~ listCarts:", listCarts);
    console.log("🚀 ~ getItems ~ listCarts:", typeof listCarts);

    // filter cart that has not been in the transaction module
    const cartItems = await Cart.findAll({
      where: {
        id: {
          [Op.notIn]: listCarts,
        },
        user_id: id,
      },
      attributes: ["id", "qty"],
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
    return response(res, 200, true, "Cart items fetched", cartItems);
  } catch (error) {
    console.log("🚀 ~ getItems ~ error:", error);
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getItems;
