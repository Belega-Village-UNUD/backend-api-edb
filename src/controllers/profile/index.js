const whoami = require("./whoami.controller");
const updateUser = require("./update.controller");
const deleteUser = require("./delete.controller");
const upAvatar = require("./avatar/upload.controller");
const deleteAvatar = require("./avatar/delete.controller");

module.exports = {
  whoami,
  updateUser,
  deleteUser,
  upAvatar,
  deleteAvatar,
};
