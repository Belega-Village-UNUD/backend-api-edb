const imagekit = require("../../configs/imagekit.config");
const { response } = require("../../utils/response.utils");

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

module.exports = multiUpload;
