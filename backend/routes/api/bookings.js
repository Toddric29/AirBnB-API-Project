const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review, SpotImage, User, Sequelize, ReviewImage, Booking } = require("../../db/models")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

//   const validateBooking = [
//     check('endDate').valueOf()
//       .exists({ checkFalsy: true })
//       .isAfter('startDate').valueOf()
//       .withMessage('endDate cannot come before startDate'),
//       handleValidationErrors
//   ];
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
                required: false,
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

router.put('/:bookingId', requireAuth, async (req, res, next) => {
    let updatedBooking;
    updatedBooking = await Booking.findByPk(
        req.params.bookingId
    )
    if (updatedBooking === null) {
        return res
            .status(404)
            .json({
                message: "Booking couldn't be found"
            })
    }
    if (req.user.id !== updatedBooking.userId) {
        return res.status(403).json({
            message: "Forbidden"
        })
    }
    if (updatedBooking.endDate < new Date()) {
        return res.status(403).json({
            message: "Past bookings can't be modified"
        })
    }
    let { startDate, endDate } = req.body;
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    const conflictBooking = await Booking.findAll({
        where: {
            spotId: updatedBooking.spotId,
            [Op.or]: [{startDate:{[Op.between]:[startDate,endDate]}},
            {endDate:{[Op.between]:[startDate,endDate]}},
          {[Op.and]:{startDate:{[Op.lte]: startDate},endDate:{[Op.gte]:endDate}}}]
        }
    });
    if (conflictBooking.length) {
        if (updatedBooking.id !== conflictBooking[0].id) {
            return res.status(403).json({
                        message: "Sorry, this spot is already booked for the specified dates",
                        errors: {
                          startDate: "Start date conflicts with an existing booking",
                          endDate: "End date conflicts with an existing booking"
                        }
                      })
        }
    }
    try {
        await updatedBooking.update(req.body)
        return res.json(updatedBooking)
    } catch(err) {
        if (err.name === 'SequelizeValidationError') {
            return res
                .status(400)
                .json({
                    message: "Bad Request",
                    errors: {
                        endDate: "endDate cannot be on or before startDate"
                    }
                })
        }
        else {
            res
                .status(500)
                .json({
                    message: err.message
                })
        }
    }
});

router.delete('/:bookingId', requireAuth, async (req, res, next) => {
    const deletedBooking = await Booking.findOne({
        where: {
            id: req.params.bookingId
        },
        attributes: {
            include: ['id']
        },
        include: {
            model: Spot,
            required: false
        }
    })
    if (deletedBooking === null) {
        return res.status(404).json({
            message: "Spot couldn't be found"
          })
    }
    if (new Date() > deletedBooking.startDate) {
        return res.status(403).json({
            message: "Bookings that have been started can't be deleted"
        })
    }
    if (deletedBooking.userId === req.user.id || deletedBooking.Spot.ownerId === req.user.id) {
        await deletedBooking.destroy()
        return res.json({
            message: "Successfully deleted"
          })
    }
    res.status(403).json({
        message: "Forbidden"
      })
})
module.exports = router;
