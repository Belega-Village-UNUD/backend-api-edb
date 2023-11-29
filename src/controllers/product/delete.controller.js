const { Product } = require("../../models");
const { response } = require("../../utils/response.utils");

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const checkProduct = await Product.findOne({ where: { id } });
    if (!checkProduct) { return response(res, 404, false, `Product ${id} Not Found`, null); }
    await Product.destroy( { where: { id } } )
    return response(res, 200, true, `Delete Product ${id} Successfull`, null);
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = deleteProduct;