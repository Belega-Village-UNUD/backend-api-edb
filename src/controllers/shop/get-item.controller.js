const { Cart, User, Product, Store, Transaction } = require("../../models");
const { response } = require("../../utils/response.utils");
const Sequelize = require("sequelize");

const getItems = async (req, res) => {
  try {
    const { id } = req.user;
    const cartItems = await Cart.findAll({
      where: { user_id: id },
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
          include: [
            {
              model: Store,
              as: "store",
              attributes: ["id", "name", "phone", "address", "description"],
            },
          ],
        },
      ],
      raw: true,
    });

    const cartIds = cartItems;
    console.log("🚀 ~ getItems ~ cartIds:", typeof cartIds);
    // convert Object into array
    //const cartIds = Object.keys(cartItems).map((key) => cartItems[key].id);
    let arrayOfCartIds;
    cartIds.forEach((element) => {
      console.log("🚀 ~ cartIds.forEach ~ element:", element);
      arrayOfCartIds = [...arrayOfCartIds, element.id];
    });
    console.log("🚀 ~ cartIds.forEach ~ arrayOfCartIds:", arrayOfCartIds);

    const transactions = await Transaction.findAll({
      where: { cart_id: { [Sequelize.Op.in]: arrayOfCartIds } },
      attributes: ["id", "status"],
    });

    if (transactions.some((transaction) => transaction.status !== "PAID")) {
      return response(res, 200, true, "Cart items fetched", cartItems);
    }

    //return response(res, 200, true, "Cart items fetched", cartItems);
    return response(
      res,
      200,
      true,
      "You have no cart at the moment, please continue shopping",
      null
    );
  } catch (error) {
    return response(res, error.status || 500, false, error.message, null);
  }
};

module.exports = getItems;
