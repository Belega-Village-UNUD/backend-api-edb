"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "userRole",
      });
      User.hasOne(models.Profile, {
        foreignKey: "user_id",
        as: "userProfile",
      });
      User.hasOne(models.OTP, {
        foreignKey: "user_id",
        as: "userOTP",
      });
      User.hasOne(models.Store, {
        foreignKey: "user_id",
        as: "userStore",
      });
      User.hasMany(models.Cart, {
        foreignKey: "user_id",
        as: "userCart",
      });
      User.hasMany(models.FeeHistory, {
        foreignKey: "store_id",
        as: "sellerFeeHistory",
      });
      User.hasMany(models.FeeHistory, {
        foreignKey: "admin_id",
        as: "adminFeeHistory",
      });
      User.hasMany(models.ProductRating, {
        foreignKey: "user_id",
        as: "userProductRating",
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
