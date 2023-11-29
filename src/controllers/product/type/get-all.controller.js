const { ProductType } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const getAllType = async (req, res) => {
  try {
    const type = await ProductType.findAll();
    if (!type) { return response(res, 404, false, `Product Type Not Found`, null); }
    return response(res, 200, true, `Get Product Type Successfull`, type);

  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
}

module.exports = getAllType;