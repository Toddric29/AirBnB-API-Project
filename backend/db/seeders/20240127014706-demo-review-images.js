'use strict';

const { Spot, User, Booking, ReviewImage, Review } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const reviewImages = [
  {
    url: 'airbnb.co/1245',
    review: 'This place was chill'
  },
  {
    url: 'airbnb.co/245',
    review: 'This place was awesome'
  },
  {
    url: 'airbnb.co/124',
    review: 'This place sucked'
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      for (let reviewImage of reviewImages) {
        let review = reviewImage.review
        delete reviewImage.review
        const reviews = await Review.findOne({
          where: {
            review: review
          }
        });
        reviewImage.reviewId = reviews.id
        await ReviewImage.create(reviewImage)
      }
   } catch (err) {
      console.log(err)
   }
  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'ReviewImages';
    return queryInterface.bulkDelete(options, {
      id: reviewImages.map(reviewImages => reviewImages.id)
    }, {});
  }
};
