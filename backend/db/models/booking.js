'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Booking.belongsTo(models.User,
        { foreignKey: 'userId'});
      Booking.belongsTo(models.Spot,
        { foreignKey: 'spotId'});

    }
  }
  Booking.init({
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Users',
          key: 'id'
      }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
          model: 'Spots',
          key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false
      },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        isAfterStartDate(value) {
          if (value <= this.startDate ) {
            throw new Error("endDate cannot be on or before startDate")
          }
        }
      }
      },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
