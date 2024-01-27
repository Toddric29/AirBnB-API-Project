'use strict';

const { Spot, User, Booking, SpotImage, Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviews = [
  {
    review: 'This place was chill',
    stars: 4,
    address: '3256 Auckland Blvd',
    email: 'user1@user.io'
  },
  {
    review: 'This place was awesome',
    stars: 5,
    address: '7845 Red St',
    email: 'user2@user.io'
  },
  {
    review: 'This place sucked',
    stars: 1,
    address: '9786 Twinlake Ave',
    email: 'demo@user.io'
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Bulkcreate here
      for (let review of reviews) {
        // console.log(spot)
        let addy = review.address
        let emails = review.email
        delete review.address
        delete review.email
        // console.log(spot)
        const user = await User.findOne({
          where: {
            email: emails
          }
        });
        const spot = await Spot.findOne({
          where: {
            address: addy
          }
        })
        review.spotId = spot.id
        review.userId = user.id
        // console.log(spot)
        await Review.create(review)
      }
   } catch (err) {
      console.log(err)
   }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Reviews', {
      id: reviews.map(review => reviews.id)
    }, {});
  }
};
