'use strict';

const { Spot, User, Booking, SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImages = [
  {
    url: 'https://listing-images.homejunction.com/heartland/HMS44887495/photo_2.jpg',
    preview: true,
    address: '3256 Auckland Blvd'
  },
  {
    url: 'https://photos.zillowstatic.com/fp/231d544176e559f89fa3002353c6ed4e-cc_ft_1536.webp',
    preview: true,
    address: '7845 Red St'
  },
  {
    url: 'https://photos.zillowstatic.com/fp/8b604bc5ad2bc5659baf0ccce53033a9-cc_ft_1536.webp',
    preview: true,
    address: '9786 Twinlake Ave'
  },
  {
    url: 'https://photos.zillowstatic.com/fp/4a02fa9e28b51d2d4dc42ab603160d30-cc_ft_1536.webp',
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
    options.tableName = 'SpotImages';
    return queryInterface.bulkDelete(options, {
      id: spotImages.map(spotImage => spotImages.id)
    }, {});
  }
};
