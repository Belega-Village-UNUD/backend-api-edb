const {
  getUser,
  getCartsBasedOnProduct,
  getTransactionBasedOnProductSuccess,
} = require("../../utils/orm.utils");
const { response } = require("../../utils/response.utils");
const {
  Product,
  Store,
  ProductRating,
  User,
  Profile,
} = require("../../models");
const { nanoid } = require("nanoid");
const { Op } = require("sequelize");

const createRating = async (req, res) => {
  try {
    const { id: user_id } = req.user;

    const { transaction_id, product_id, rate, review } = req.body;
    if (!product_id || !transaction_id || !rate || !review) {
      return response(res, 400, false, "All field is required", null);
    }

    const user = await getUser(user_id);
    if (!user) return response(res, 404, false, "User not found", null);

    const carts = await getCartsBasedOnProduct(product_id);
    if (carts.length === 0) {
      return response(res, 404, false, "Product not found", null);
    }

    const storeId = carts.map((cart) => cart.product.store_id);

    const store = await Store.findOne({
      where: { id: { [Op.in]: storeId } },
    });
    if (!store) return response(res, 404, false, "Store not found", null);

    const transactionSuccess = await getTransactionBasedOnProductSuccess(
      product_id,
      transaction_id,
      user.id
    );
    if (!transactionSuccess) {
      return response(
        res,
        404,
        false,
        "Transaction not found or not successful",
        null
      );
    }

    const existingRating = await ProductRating.findOne({
      where: { transaction_id, product_id },
    });
    if (existingRating) {
      return response(res, 400, false, "Product has already been rated", null);
    }

    const productRating = await ProductRating.create({
      id: nanoid(10),
      transaction_id,
      product_id,
      store_id: store.id,
      user_id: user.id,
      rate,
      review,
    });

    const createdRating = await ProductRating.findOne({
      include: [
        {
          model: Product,
          as: "product",
        },
        {
          model: Store,
          as: "store",
          include: [
            {
              model: User,
              as: "user",
              attributes: ["id", "email"],
              include: [
                {
                  model: Profile,
                  as: "userProfile",
                  attributes: ["id", "name", "city", "province"],
                },
              ],
            },
          ],
        },
        {
          model: User,
          as: "user",
          attributes: ["id", "email"],
          include: [
            {
              model: Profile,
              as: "userProfile",
              attributes: ["id", "name", "city", "province"],
            },
          ],
        },
      ],
      where: {
        id: productRating.id,
        product_id,
        user_id: user.id,
      },
    });
    if (!createdRating)
      return response(res, 400, false, "Failed to create review", null);

    return response(
      res,
      200,
      true,
      `Successfull Review ${createdRating.product.name_product} in store ${createdRating.store.name}`,
      createdRating
    );
  } catch (err) {
    console.error(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = createRating;
