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
      Booking.belongsTo(models.User);
      Booking.belongsTo(models.Spot);
    }
  }
  Booking.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
          model: 'Users',
          key: 'id'
      }
    },
    spotId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
          model: 'Spots',
          key: 'id'
      }
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    endDate: {
      type: DataTypes.DATE,
      allowNull: false,
        // defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
  }, {
    sequelize,
    modelName: 'Booking',
  });
  return Booking;
};
