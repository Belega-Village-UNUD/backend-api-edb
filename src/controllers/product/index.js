const getAll = require("./get-all.controller")
const getOne = require("./get-one.controller")
const create = require("./create.controller");
const update = require("./update.controller");
const deleteProduct = require("./delete.controller");

const productType = require("./type");

module.exports = {
  getAll,
  getOne,
  create,
  update,
  deleteProduct,
  productType,
}