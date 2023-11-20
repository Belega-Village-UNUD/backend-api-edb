const imagekit = require("../../configs/imagekit.config");
const { response } = require("../../utils/response.utils");
const path = require("path");

const singleUpload = async (req, res) => {
  try {
    let stringFile = req.file.buffer.toString("base64");
    let { url } = await imagekit.upload({
      fileName: Date.now() + path.extname(req.file.originalname),
      file: stringFile,
    });
    return response(res, 200, true, "File uploaded successfully", { url });
  } catch (err) {
    return response(res, res.status || 500, false, err.message, null);
  }
};

module.exports = singleUpload;
