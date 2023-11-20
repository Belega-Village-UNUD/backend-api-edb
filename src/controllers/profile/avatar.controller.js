const { User, Profile } = require("../../models");
const { singleUpload } = require("../../utils/imagekit.utils");
const { response } = require("../../utils/response.utils");
const path = require("path");

const upAvatar = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findOne({
      where: { id: id },
      attributes: { exclude: ["password"] },
    });

    const upload = await singleUpload(req, res);

    await Profile.update(
      { avatar_link: upload.url },
      { where: { user_id: user.id } }
    );

    const profile = await Profile.findOne({ where: { user_id: user.id } });

    return response(res, 200, upload.success, "Successfully Update Avatar", {
      user,
      profile,
      url: upload.url,
    });
  } catch (err) {
    return response(res, err.status || 500, false, err.message, null);
  }
};

module.exports = upAvatar;
