'use strict';

const { Spot, User, Booking } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const bookings = [
  {
    email: 'user1@user.io',
    address: '3256 Auckland Blvd'
  },
  {
    email: 'user2@user.io',
    address: '7845 Red St'
  },
  {
    email: 'user2@user.io',
    address: '7850 Red St'
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Bulkcreate here
      for (let booking of bookings) {
        // console.log(spot)
        let emails = booking.email
        let addy = booking.address
        delete booking.email
        delete booking.address
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
        booking.userId = user.id
        booking.spotId = spot.id
        // console.log(spot)
        await Booking.create(booking)
      }
   } catch (err) {
      console.log(err)
   }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', {
      id: bookings.map(booking => booking.id)
    }, {});
  }
};
