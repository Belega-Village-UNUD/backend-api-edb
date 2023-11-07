const ejs = require("ejs");

const emailTemplate = (fileName, data) => {
  return new Promise((resolve, reject) => {
    const path = __dirname + "/../templates/" + fileName;
    ejs.renderFile(path, data, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
};

module.exports = emailTemplate;
