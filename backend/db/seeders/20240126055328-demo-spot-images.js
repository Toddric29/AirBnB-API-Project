'use strict';

const { Spot, User, Booking, SpotImage } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spotImages = [
  {
    url: ['https://listing-images.homejunction.com/heartland/HMS44887495/photo_2.jpg',
          'https://listing-images.homejunction.com/heartland/HMS44887495/photo_2.jpg',
          'https://listing-images.homejunction.com/heartland/HMS44887495/photo_3.jpg',
          'https://listing-images.homejunction.com/heartland/HMS44887495/photo_4.jpg',
          'https://listing-images.homejunction.com/heartland/HMS44887495/photo_5.jpg'],
    address: '3256 Auckland Blvd'
  },
  {
    url: ['https://photos.zillowstatic.com/fp/231d544176e559f89fa3002353c6ed4e-cc_ft_1536.webp',
          'https://photos.zillowstatic.com/fp/a87f40b320234e46fab3b53f1d703a63-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/0a0a1cdfa37f2648508be48e502908e5-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/0533843d153f34adeb25256f5510a6da-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/81753fe2d644e8117aefbeec7e76e9da-cc_ft_768.webp']
  ,
    address: '7845 Red St'
  },
  {
    url: ['https://photos.zillowstatic.com/fp/8b604bc5ad2bc5659baf0ccce53033a9-cc_ft_1536.webp',
          'https://photos.zillowstatic.com/fp/edb239f2217616a1263cb4e28ae2fc32-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/f1fd7d5c8331195d672e1ebeb853b5dc-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/530fe259a73efd3a6ae51db6c451a3a0-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/cb34af35f8862890fc96ab3b2e6a275b-cc_ft_768.webp'],
    address: '9786 Twinlake Ave'
  },
  {
    url: ['https://photos.zillowstatic.com/fp/4a02fa9e28b51d2d4dc42ab603160d30-cc_ft_1536.webp',
          'https://photos.zillowstatic.com/fp/dabb959781d2ea72afd7f446253c5669-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/5e638333d2ff287bc1eb05ee74111744-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/9aa51fa82a8dc19b92907a7fed713f2a-cc_ft_768.webp',
          'https://photos.zillowstatic.com/fp/6f4def397430423c174c1256f750591e-cc_ft_768.webp'],
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
        // delete spotImage.address
        // console.log(spot)
        const spot = await Spot.findOne({
          where: {
            address: addy
          }
        })
        for(let [index, url] of spotImage.url.entries()){
          const image = {
            preview: index === 0,
            spotId: spot.id,
            url
          }
          await SpotImage.create(image)
        }
        // console.log(spot)

      }
   } catch (err) {
      console.log(err)
   }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'SpotImages';
    // return queryInterface.bulkDelete(options, {
    //   id: spotImages.map(spotImage => spotImages.id)
    // }, {});
    for (let spotImage of spotImages) {
      let addy = spotImage.address
      const spot = await Spot.findOne({
        where: {
          address: addy
        }
      })
      await spot.removeSpotImages()
  }
}
};
