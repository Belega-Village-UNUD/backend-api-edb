const { ProductType } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const deleteType = async (req, res) => {
  try {
    const { id } = req.params;
    const checkProductType = await ProductType.findOne({ where: { id } });
    if (!checkProductType) {
      return response(res, 404, false, `Product Type ${id} Not Found`, null);
    }
    await ProductType.destroy({ where: { id } });
    return response(
      res,
      200,
      true,
      `Delete Product Type ${id} Successfull`,
      null
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = deleteType;
