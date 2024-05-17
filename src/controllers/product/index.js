const getAllProductBuyer = require("./buyer/get-all.controller");
const getOneProductBuyer = require("./buyer/get-one.controller");
const getAllProductGuest = require("./guest/get-all.controller");
const getOneProductGuest = require("./guest/get-one.controller");
const getAllProductSeller = require("./seller/get-all.controller");
const getOneProductSeller = require("./seller/get-one.controller");
const create = require("./seller/create.controller");
const update = require("./seller/update.controller");
const deleteProduct = require("./seller/delete.controller");
const imageProduct = require("./seller/image-product.controller");

const type = require("./type");

module.exports = {
  getAllProductBuyer,
  getOneProductBuyer,
  getAllProductGuest,
  getOneProductGuest,
  getAllProductSeller,
  getOneProductSeller,
  create,
  update,
  deleteProduct,
  imageProduct,
  type,
};
