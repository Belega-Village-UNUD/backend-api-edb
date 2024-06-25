const create = require("./create.controller");
const getFee = require("./get-fee.controller");
const update = require("./update.controller");
const deleteFee = require("./delete.controller");
const charged = require("./charged.controller");
const getHistory = require("./get-history.controller");
// const getOneHistory = require("./get-onehistory.controller");

module.exports = {
  create,
  getFee,
  update,
  deleteFee,
  charged,
  getHistory,
  // getOneHistory,
};
