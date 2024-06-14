"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Fee extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.hasMany(models.FeeHistory, {
        foreignKey: "fee_id",
        as: "feeHistory",
      });
    }
  }
  Fee.init(
    {
      name: DataTypes.STRING,
      interest: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("interest");
          return value === null ? null : parseFloat(value);
        },
      },
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Fee",
    }
  );
  return Fee;
};
