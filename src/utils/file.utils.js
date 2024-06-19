const fs = require("fs");
const path = require("path");

module.exports = {
  readFileSyncJSON: (file) => {
    const filePath = "../../json/" + file;
    const fileData = fs.readFileSync(path.join(__dirname, filePath));
    let parsedData = JSON.parse(fileData);
    return parsedData;
  },
};
