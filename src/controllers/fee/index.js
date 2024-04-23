const create = require("./create.controller");
const getAll = require("./get-all.controller");
const getOne = require("./get-one.controller");
const update = require("./update.controller");
const deleteFee = require("./delete.controller");
const charged = require("./charged.controller");

module.exports = {
  create,
  getAll,
  getOne,
  update,
  deleteFee,
  charged,
};
