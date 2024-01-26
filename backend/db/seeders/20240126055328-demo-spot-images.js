'use strict';

const { Spot, User, Booking, SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImages = [
  {
    url: 'airbnb.co/1234',
    preview: true,
    address: '3256 Auckland Blvd'
  },
  {
    url: 'airbnb.co/234',
    preview: true,
    address: '7845 Red St'
  },
  {
    url: 'airbnb.co/134',
    preview: true,
    address: '7850 Red St'
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Bulkcreate here
      for (let spotImage of spotImages) {
        // console.log(spot)
        let addy = spotImage.address
        delete spotImage.address
        // console.log(spot)
        const spot = await Spot.findOne({
          where: {
            address: addy
          }
        })
        spotImage.spotId = spot.id
        // console.log(spot)
        await SpotImage.create(spotImage)
      }
   } catch (err) {
      console.log(err)
   }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('SpotImages', {
      id: spotImages.map(spotImage => spotImages.id)
    }, {});
  }
};
