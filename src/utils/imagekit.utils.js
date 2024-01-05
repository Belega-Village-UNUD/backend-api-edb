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

/** TODO: delete the uploaded image from the imagekit host because,
 * the problem is that the imagekit return 403 meanwhile we have the
 * authorized key for deleting the image
 * documentation: https://docs.imagekit.io/api-reference/media-api/delete-file
 * I've read some issues that other person also cannot delete their image from the
 * imagekit host such as: https://www.pythonanywhere.com/forums/topic/27752/.
 */
const deleteUploaded = (url) => {
  const fileId = url.split("/").pop();

  /** File Without extensions, possible way, but still got 403 */
  //let extensionIndex = filename.lastIndexOf(".");
  //let fileId = filename.substring(0, extensionIndex);

  let APIresponse = { sucess: null, result: null };

  return new Promise((resolve, reject) => {
    imagekit.deleteFile(fileId, function (err, result) {
      if (err) {
        APIresponse = { success: false, result: err };
        reject(APIresponse);
      } else {
        APIresponse = { success: true, result: result };
        resolve(APIresponse);
      }
    });
  });
};

module.exports = { singleUpload, multiUpload, deleteUploaded };
