const imagekit = require('../configs/imagekit.config')
const { response } = require("../utils/response.utils");
const path = require("path");

const singleUpload = async (req, res) => {
  try {
    let stringFile = req.file.buffer.toString("base64");
    let { url } = await imagekit.upload({
      fileName: Date.now() + path.extname(req.file.originalname),
      file: stringFile,
    });
    return { success: true, url: url };
  } catch (err) {
    return { success: false, err: err };
  }
};

const multiUpload = async (req, res) => {
  try {
    let urls = [];
    for (let file of req.files) {
      let result = await imagekit.upload({
        file: file.buffer.toString("base64"),
        fileName: file.filename,
        useUniqueFileName: true,
      });
      urls.push(result.url);
    }

    return response(res, 200, true, "File uploaded successfully", { urls });
  } catch (err) {
    return response(res, res.status || 500, false, err.message, null);
  }
};

module.exports = { singleUpload, multiUpload}