"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DetailTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transaction",
      });
    }
  }
  DetailTransaction.init(
    {
      transaction_id: DataTypes.STRING,
      carts_details: DataTypes.JSON,
      sub_total_transaction_price_before_shipping: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue(
            "sub_total_transaction_price_before_shipping"
          );
          return value === null ? null : parseFloat(value);
        },
      },
      sub_total_shipping: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("sub_total_shipping");
          return value === null ? null : parseFloat(value);
        },
      },
      total_final_price: {
        type: DataTypes.DECIMAL,
        get() {
          const value = this.getDataValue("total_price");
          return value === null ? null : parseFloat(value);
        },
      },
      receipt_link: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "DetailTransaction",
    }
  );
  return DetailTransaction;
};
