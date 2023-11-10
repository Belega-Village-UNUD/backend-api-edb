require("dotenv").config();
const { response } = require("../utils/response.utils");
const jwt = require("jsonwebtoken");

const restrict = (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      return response(
        res,
        401,
        false,
        "You are not authorized wrong headers",
        null
      );
    }
    const token = header.split(" ")[1];
    if (!token) {
      return response(
        res,
        401,
        false,
        "You are not authorized wrong token",
        null
      );
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload;

    next();
  } catch (err) {
    switch (err && err.message) {
      case "jwt malformed":
      case "jwt expired":
        return response(res, 401, false, err.message, null);
      default:
        break;
    }
    return response(res, err.status, false, err.message, null);
    next(err);
  }
};

module.exports = restrict;
