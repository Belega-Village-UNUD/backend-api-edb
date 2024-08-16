const avatarStore = require("./avatar-store.controller");
const imageStore = require("./image-store.controller");
const getProfileStore = require("./get-profile.controller");
const updateProfileStore = require("./update-profile.controller");
const getStore = require("./get-store.controller");
const getBalance = require("./balance.controller");
const getStoreInfo = require("./info.controller");

module.exports = {
  avatarStore,
  imageStore,
  getProfileStore,
  updateProfileStore,
  getStore,
  getBalance,
  getStoreInfo,
};
