const imagekit = require("../../configs/imagekit.config");
const { response } = require("../../utils/response.utils");
const path = require("path");

const singleUpload = async (req, res) => {
  let folder = req.file.destination.split("../public/")[1];
  const url = `${req.protocol}://${req.get("host")}/${folder}/${
    req.file.filename
  }`;
  return response(res, 200, true, "File uploaded successfully", { url });
};

module.exports = singleUpload;
