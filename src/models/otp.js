"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class OTP extends Model {
    static associate(models) {
      OTP.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
    }
  }
  OTP.init(
    {
      code: DataTypes.STRING,
      user_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "OTP",
    }
  );
  return OTP;
};
