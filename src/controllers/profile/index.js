const whoami = require("./whoami.controller");
const updateUser = require("./update.controller");
const deleteUser = require("./delete.controller");
const upAvatar = require("./avatar.controller");

module.exports = {
  whoami,
  updateUser,
  deleteUser,
  upAvatar,
};
