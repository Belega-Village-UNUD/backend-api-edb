const fs = require("fs");
const path = require("path");

module.exports = {
  readFileSyncJSON: (file) => {
    const fileData = fs.readFileSync(path.join(__dirname, file));
    let parsedData = JSON.parse(fileData);
    return parsedData;
  },
};
