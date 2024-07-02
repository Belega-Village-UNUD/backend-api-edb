const getCity = require("./city.controller");
const getProvince = require("./province.controller");
const costs = require("./costs.controller");
const arrived = require("./buyer/arrived.controller");
const send = require("./seller/send.controller");

module.exports = {
  getCity,
  getProvince,
  costs,
  arrived,
  send,
};
