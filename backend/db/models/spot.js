'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Spot extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId"
      });
      Spot.belongsTo(models.User, {
        foreignKey: "ownerId",
        as: "Owner"
      });
      Spot.belongsToMany(models.User, {
        through: models.Booking,
        foreignKey: "userId"
      });
      Spot.hasMany(models.Booking, {
        foreignKey: 'spotId'
      });
      Spot.hasMany(models.Review, {
        foreignKey: 'spotId'
      });
      Spot.hasMany(models.SpotImage, {
        foreignKey: 'spotId'
      });
    }
  }
  Spot.init({
    ownerId: {
      type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
  }
  },
    address: {
      type: DataTypes.STRING,
    allowNull: false
  },
    city: {
      type: DataTypes.STRING,
    allowNull: false
  },
    state: {
      type: DataTypes.STRING,
    allowNull: false
  },
    country: {
      type: DataTypes.STRING,
    allowNull: false
  },
    lat: {
      type: DataTypes.DECIMAL,
    allowNull: false,
  //   validate: {
  //     min: {
  //       args: -90,
  //       msg: "Latitude is not valid" },
  //     max: {
  //       args: 90,
  //       msg: "Latitude is not valid" },
  // }
  },
    lng: {
      type: DataTypes.DECIMAL,
    allowNull: false,
    // validate: {
    //     min: {
    //       args: -180,
    //       msg: "Longitude is not valid" },
    //     max: {
    //       args: 180,
    //       msg: "Longitude is not valid" },
    // }
  },
    name: {
      type: DataTypes.STRING,
    allowNull: false,
  },
    description: {
      type: DataTypes.STRING,
    allowNull: false
  },
    price: {
      type: DataTypes.DECIMAL,
    allowNull: false
  }
  }, {
    sequelize,
    modelName: 'Spot',
    scopes: {
      authorization(id){
      return {
        where: {
          ownerId: id
        }
      }
    }
  }
  });
  return Spot;
};
