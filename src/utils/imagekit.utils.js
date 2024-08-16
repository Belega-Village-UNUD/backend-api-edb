const imagekit = require("../configs/imagekit.config");
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
        fileName: Date.now() + path.extname(file.originalname),
        useUniqueFileName: true,
      });
      urls.push(result.url);
    }

    return { success: true, urls: urls };
  } catch (err) {
    return { success: false, err: err };
  }
};

module.exports = { singleUpload, multiUpload };
