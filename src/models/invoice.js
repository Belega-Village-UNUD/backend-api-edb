"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Invoice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.DetailTransaction, {
        foreignKey: "detail_transaction_id",
        as: "detail_transaction",
      });
      this.belongsTo(models.Store, {
        foreignKey: "store_id",
        as: "store",
      });
    }
  }
  Invoice.init(
    {
      detail_transaction_id: DataTypes.STRING,
      store_id: DataTypes.STRING,
      shipping_method: DataTypes.STRING,
      shipping_price: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("shipping_price");
          return value === null ? null : parseFloat(value);
        },
      },
      total_price: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("total_price");
          return value === null ? null : parseFloat(value);
        },
      },
    },
    {
      sequelize,
      modelName: "Invoice",
    }
  );
  return Invoice;
};
