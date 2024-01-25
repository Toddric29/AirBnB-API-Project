'use strict';

const { Spot } = require('../models');
const bcrypt = require("bcryptjs");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

const spots = [
  {
    address: '9786 Twinlake Ave',
    city: 'Utopia',
    state: 'Kansas',
    country: 'USA',
    lat: 90,
    lng: -23,
    name: 'Maj',
    description: 'A place to jam',
    price: 123
  },
  {
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
    address: '7845 Red St',
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
      await Spot.bulkCreate(spots, { validate: true });
   } catch (err) {
      console.log(err)
   }

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Spots', {
      address: spots.map(spot => spot.address)
    }, {});
  }
};
