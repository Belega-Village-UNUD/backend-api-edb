"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Review extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.Transaction, {
        foreignKey: "transaction_id",
        as: "transactionReview"
      });
    }
  }
  Review.init(
    {
      transaction_id: DataTypes.STRING,
      rating: DataTypes.INTEGER(5), // TODO: update to tiny int later, because postgres does not support the integer.
      comment: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Review",
    }
  );
  return Review;
};
