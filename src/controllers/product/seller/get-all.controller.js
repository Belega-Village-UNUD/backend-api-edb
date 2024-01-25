const { response } = require("../../../utils/response.utils");
const { Product } = require("../../../models");

const getAllSellerProduct = async (req, res) => {
  try {
    const product = await Product.findAll();
    if (!product) {
      return response(res, 404, false, `Product Not Found`, null);
    }
    return response(res, 200, true, `Get Product Successfull`, product);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = getAllSellerProduct;
