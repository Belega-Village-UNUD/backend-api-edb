const { Profile } = require("../../../models");
const { deleteUploaded } = require("../../../utils/imagekit.utils");
const { response } = require("../../../utils/response.utils");

const deleteAvatar = async (req, res) => {
  try {
    const user = req.user;
    const { avatar_link } = await Profile.findOne({
      where: { user_id: user.id },
      attributes: ["avatar_link"],
    });
    const APIresponse = await deleteUploaded(avatar_link);
    await Profile.update(
      { avatar_link: null },
      { where: { user_id: user.id } }
    );
    return response(
      res,
      200,
      true,
      "Successfully Deleted",
      APIresponse.result.message
    );
  } catch (err) {
    return response(res, err.status || 500, false, err.result.message, null);
  }
};

module.exports = deleteAvatar;
