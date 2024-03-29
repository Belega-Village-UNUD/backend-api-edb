const { nanoid } = require("nanoid");
const { Product, User, Store } = require("../../models");
const { response } = require("../../utils/response.utils");

const createProduct = async (req, res) => {
  try {
    const { id } = req.user;

    if (
      !store_id ||
      !name_product ||
      !productTypeId ||
      !description ||
      !price ||
      !stock
    ) {
      return response(res, 400, false, "Invalid input data", null);
    }

    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return response(res, 404, false, "User not found", null);
    }

    const store = await Store.findOne({ where: { user_id: user.id } });
    if (!store) {
      return response(
        res,
        404,
        false,
        "Store not found, please register as a seller first!",
        null
      );
    }
    const { name_product, productTypeId, description, price, stock } = req.body;
    const product = await Product.create({
      id: nanoid(10),
      user_id: user.id,
      store_id: store.id,
      type_id: productTypeId,
      name_product: name_product,
      desc_product: description,
      price: price,
      stock: stock,
    });
    return response(res, 200, true, `Product ${id} has been created`, product);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = createProduct;
