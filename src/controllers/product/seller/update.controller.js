const { Product } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name_product, productTypeId, description, price, stock } = req.body;
    const { store_id } = req.body;
    const product = await Product.findOne({ where: { id: id } });
    if (!product) {
      return response(res, 404, false, `Product Not Found`, null);
    }
    await Product.update(
      {
        name_product,
        type_id: productTypeId,
        description,
        price,
        stock,
        store_id,
      },
      { where: { id: id } }
    );
    const updateProduct = await Product.findOne({ where: { id: id } });
    return response(
      res,
      200,
      true,
      `Product ${name_product} has been updated`,
      updateProduct
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = updateProduct;
