'use strict';

const { Spot, User } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spots = [
  {
    email: 'demo@user.io',
    address: '9786 Twinlake Ave',
    city: 'Utopia',
    state: 'Kansas',
    country: 'USA',
    lat: 35,
    lng: 40,
    name: 'Maj',
    description: 'A place to jam',
    price: 75
  },
  {
    email: 'user1@user.io',
    address: '3256 Auckland Blvd',
    city: 'Memphis',
    state: 'TN',
    country: 'USA',
    lat: 91,
    lng: -20,
    name: 'Emoh',
    description: 'A place you can call home',
    price: 323
  },
  {
    email: 'user2@user.io',
    address: '7845 Red St',
    city: 'Compton',
    state: 'CA',
    country: 'USA',
    lat: 65,
    lng: -3,
    name: 'Bunker',
    description: 'Somewhere you"ll feel safe',
    price: 400
  },
  {
    email: 'user2@user.io',
    address: '7850 Red St',
    city: 'Compton',
    state: 'CA',
    country: 'USA',
    lat: 65,
    lng: -3,
    name: 'Bunker',
    description: 'Somewhere you"ll feel safe',
    price: 400
  }
]

module.exports = {
  async up (queryInterface, Sequelize) {
    try {
      // Bulkcreate here
      for (let spot of spots) {
        // console.log(spot)
        let emails = spot.email
        delete spot.email
        // console.log(spot)
        const user = await User.findOne({
          where: {
            email: emails
          }
        })
        spot.ownerId = user.id
        // console.log(spot)
        await Spot.create(spot)
      }
   } catch (err) {
      console.log(err)
   }

  },

  async down (queryInterface, Sequelize) {
    options.tableName = 'Spots';
    return queryInterface.bulkDelete(options, {
      address: spots.map(spot => spot.address)
    }, {});
  }
};
