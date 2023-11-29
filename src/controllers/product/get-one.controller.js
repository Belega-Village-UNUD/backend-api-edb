const { Product } = require("../../models");
const { response } = require("../../utils/response.utils");

const getOneProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findOne({ where: { id }});
    if (!product) { return response(res, 404, false, `Product Type ${id} Not Found`, null); }
    return response(res, 200, true, `Get Product Type ${id} Successfull`, product);

  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
}

module.exports = getOneProduct;