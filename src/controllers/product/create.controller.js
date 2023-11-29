const { nanoid } = require("nanoid");
const { Product, User } = require("../../models");
const { response } = require("../../utils/response.utils");

const createProduct = async (req, res) => {
  try {
    const { id } = req.user;
    const { name_product, productTypeId, description, price, stock } = req.body;
    const { store_id } = req.body;
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ["password"] },
    });
    const product = await Product.create({
      id: nanoid(10),
      user_id: user.id,
      store_id: store_id,
      type_id: productTypeId,
      image_product: null,
      name_product: name_product,
      desc_product: description,
      price: price,
      stock: stock,
    });
    return response(
      res,
      200,
      true,
      `Product ${id} has been created`,
      product
    );
    
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = createProduct;