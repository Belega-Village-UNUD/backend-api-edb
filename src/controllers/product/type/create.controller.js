const { nanoid } = require("nanoid");
const { ProductType } = require("../../../models")
const { response } = require("../../../utils/response.utils");


const createType = async (req, res) => {
  try {
    const { name, material } = req.body;

    const productType = await ProductType.create({
      id: nanoid(10),
      name: name,
      material: material,
    });

    return response(
      res,
      200,
      true,
      "Product type has been created",
      productType
    );

  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = createType;