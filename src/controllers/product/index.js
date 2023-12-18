const getAllProduct = require("./get-all.controller");
const getOneProduct = require("./get-one.controller");
const createProduct = require("./create.controller");
const updateProduct = require("./update.controller");
const deleteProduct = require("./delete.controller");
const uploadImage = require("./upload-image.controller");

const productType = require("./type");
const guestProduct = require("./guest");

module.exports = {
  getAllProduct,
  getOneProduct,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
  productType,
  guestProduct,
};
