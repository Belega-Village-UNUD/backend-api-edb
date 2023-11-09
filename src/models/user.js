"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
      User.hasOne(models.Profile, {
        foreignKey: "user_id",
        as: "profile",
      });
    }
  }
  User.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      role_id: DataTypes.ARRAY(DataTypes.STRING),
      is_verified: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};
