const { User, Store } = require("../../models");
const { singleUpload } = require("../../utils/imagekit.utils");
const { response } = require("../../utils/response.utils");

const imageStore = async (req, res) => {
  try {
    const { name } = req.body;

    const store = await Store.findOne({ where: { name } });

    if (!store) {
      return response(res, 404, false, "Store not found", null);
    }

    const upload = await singleUpload(req, res);

    if (!upload) {
      return response(res, 400, false, "File upload failed", null);
    }

    await Store.update({ image_link: upload.url }, { where: { name } });

    return response(res, 200, upload.success, "Successfully Update Image", {
      name,
      image_url: upload.url,
    });
  } catch (err) {
    console.error(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = imageStore;
