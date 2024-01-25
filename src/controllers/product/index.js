// const getAllProduct = require("./get-all.controller");
// const getOneProduct = require("./get-one.controller");
// const createProduct = require("./create.controller");
// const updateProduct = require("./update.controller");
// const deleteProduct = require("./delete.controller");
// const uploadImage = require("./upload-image.controller");

const guest = require("./guest");
const buyer = require("./buyer");
const seller = require("./seller");

const type = require("./type");

module.exports = {
  // getAllProduct,
  // getOneProduct,
  // createProduct,
  // updateProduct,
  // deleteProduct,
  // uploadImage,

  guest,
  buyer,
  seller,

  type,
};
