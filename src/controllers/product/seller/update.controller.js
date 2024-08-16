const { Product, User, Store } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const updateProduct = async (req, res) => {
  try {
    const { id: product_id } = req.params;
    const { id: user_id } = req.user;

    const user = await User.findOne({
      where: { id: user_id },
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

    const product = await Product.findOne({
      attributes: { exclude: ["image_product"] },
      where: { id: product_id, display: true },
    });
    if (!product) {
      return response(res, 404, false, `Product Not Found`, null);
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

    await Product.update(
      {
        name_product: name_product,
        type_id: productTypeId,
        desc_product: description,
        price: price,
        stock: stock,
        weight_gr: weight_gr,
        is_preorder: is_preorder,
      },
      { where: { id: product_id } }
    );
    const updateProduct = await Product.findOne({
      attributes: { exclude: ["image_product"] },
      where: { id: product_id, display: true },
    });
    return response(
      res,
      200,
      true,
      `Product ${product.name_product} has been updated`,
      updateProduct
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = updateProduct;
