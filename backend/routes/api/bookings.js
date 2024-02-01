const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review, SpotImage, User, Sequelize, ReviewImage, Booking } = require("../../db/models")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

router.get('/current',requireAuth, async (req, res, next) => {
    let userBookings;
    userBookings = await Booking.findAll({
        where: {
            userId: req.user.id,
        },
        attributes: {
            include: ['id']
        },
        include: [
        {
            model: Spot,
            attributes: {
                exclude: ['description', 'createdAt', 'updatedAt']
            },
            include: {
                model:SpotImage,
                attributes: [['url', 'previewImage']],
            }
        }]
    })
    userBookings = userBookings.map(userBooking => {
        const jsonSpot = userBooking.toJSON();
        if (jsonSpot.Spot.SpotImages[0]) {
            jsonSpot.previewImage = jsonSpot.Spot.SpotImages[0].previewImage;
          } else {
            jsonSpot.previewImage = null;
          }
          delete jsonSpot.Spot.SpotImages
        return jsonSpot;
      });
      res.json({Bookings: userBookings});
})


module.exports = router;
