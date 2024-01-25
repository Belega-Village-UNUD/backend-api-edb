const { ProductType } = require("../../../../models");
const { response } = require("../../../../utils/response.utils");

const updateSellerType = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, material } = req.body;
    const checkType = await ProductType.findOne({ where: { id: id } });
    if (!checkType) {
      return response(res, 404, false, `Product type ${id} not found`, null);
    }
    await ProductType.update({ name, material }, { where: { id: id } });
    const productType = await ProductType.findOne({ where: { id: id } });
    return response(
      res,
      200,
      true,
      `Product type ${id} has been updated`,
      productType
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = updateSellerType;
