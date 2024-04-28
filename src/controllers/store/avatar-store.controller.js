const { where } = require("sequelize");
const { Store, User } = require("../../models");
const { singleUpload } = require("../../utils/imagekit.utils");
const { response } = require("../../utils/response.utils");

const avatarStore = async (req, res) => {
  try {
    const { id } = req.user;

    const user = await User.findOne({ where: { id } });
    const store = await Store.findOne({ where: { user_id: user.id } });

    if (!store) {
      return response(res, 404, false, "Store not found", null);
    }

    const upload = await singleUpload(req, res);

    if (!upload) {
      return response(res, 400, false, "File upload failed", null);
    }

    await Store.update(
      { avatar_link: upload.url },
      { where: { user_id: user.id } }
    );

    return response(res, 200, upload.success, "Successfully Update Avatar", {
      name_store: store.name_store,
      avatar_url: upload.url,
    });
  } catch (err) {
    console.error(err);
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = avatarStore;
