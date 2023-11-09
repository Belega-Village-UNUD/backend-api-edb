"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Access extends Model {
    static associate(models) {
      Access.belongsTo(models.Role, {
        foreignKey: "role_id",
        as: "role",
      });
      Access.belongsTo(models.Module, {
        foreignKey: "module_id",
        as: "module",
      });
    }
  }
  Access.init(
    {
      role_id: DataTypes.STRING,
      module_id: DataTypes.STRING,
      read: DataTypes.BOOLEAN,
      write: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Access",
    }
  );
  return Access;
};
