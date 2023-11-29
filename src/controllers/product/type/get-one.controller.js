const { ProductType } = require("../../../models");
const { response } = require("../../../utils/response.utils");

const getOneType = async (req, res) => {
  try {
    const { id } = req.params;
    const type = await ProductType.findOne({ where: { id }});
    if (!type) { return response(res, 404, false, `Product Type ${id} Not Found`, null); }
    return response(res, 200, true, `Get Product Type ${id} Successfull`, type);

  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
}

module.exports = getOneType;