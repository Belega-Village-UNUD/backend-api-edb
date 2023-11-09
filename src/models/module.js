"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Module extends Model {
    static associate(models) {
      Module.hasMany(models.Access, {
        foreignKey: "module_id",
        as: "module",
      });
    }
  }
  Module.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Module",
    }
  );
  return Module;
};
