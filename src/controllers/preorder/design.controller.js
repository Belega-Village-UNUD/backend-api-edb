const { nanoid } = require("nanoid");
const { User, CustomDesign } = require("../../models");
const { singleUpload } = require("../../utils/imagekit.utils");
const { response } = require("../../utils/response.utils");

const upCustomDesign = async (req, res) => {
  try {
    const { id } = req.user;
    const { height, width, product_id, budget } = req.body;
    const user = await User.findOne({
      where: { id: id },
      attributes: { exclude: ["password"] },
    });

    const upload = await singleUpload(req, res);

    const customDesign = await CustomDesign.create({
      id: nanoid(10),
      user_id: user.id,
      product_id: product_id,
      image_link: upload.url,
      height: height,
      width: width,
      budget: budget,
    });

    return response(
      res,
      200,
      upload.success,
      "Successfully Uploaded Custom Design",
      {
        user,
        customDesign,
        url: upload.url,
      }
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = upCustomDesign;
