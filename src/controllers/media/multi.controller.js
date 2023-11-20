const imagekit = require("../../configs/imagekit.config");
const { response } = require("../../utils/response.utils");
const path = require("path");

const multiUpload = async (req, res) => {
  let urls = [];
  req.files.forEach((file) => {
    let folder = file.destination.split("../public/")[1];
    const url = `${req.protocol}://${req.get("host")}/${folder}/${
      file.filename
    }`;
    urls.push(url);
  });

  return response(res, 200, true, "File uploaded successfully", { urls });
};

module.exports = multiUpload;
