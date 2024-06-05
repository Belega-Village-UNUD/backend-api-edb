const { nanoid } = require("nanoid");
const { Product, User, Store } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const createProduct = async (req, res) => {
  try {
    const { id } = req.user;

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

    // TODO: Create a middleware to check if store is verified
    isStoreVerified = store.is_verified === "VERIFIED" ? true : false;

    if (!isStoreVerified) {
      return response(
        res,
        403,
        false,
        "Store not verified, please wait until store verified by admin",
        null
      );
    }

    const {
      name_product,
      productTypeId,
      description,
      price,
      stock,
      weight_gr,
      is_preorder,
    } = req.body;

    if (
      !name_product ||
      !productTypeId ||
      !description ||
      !price ||
      !stock ||
      !weight_gr ||
      is_preorder === null
    ) {
      return response(res, 400, false, "Invalid input data", null);
    }

    const product = await Product.create({
      id: nanoid(10),
      user_id: user.id,
      store_id: store.id,
      type_id: productTypeId,
      name_product: name_product,
      desc_product: description,
      price: price,
      stock: stock,
      weight_gr: weight_gr,
      is_preorder: is_preorder,
    });
    return response(res, 200, true, `Product has been created`, product);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = createProduct;
