const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review, SpotImage, User, ReviewImage, Booking, Sequelize } = require("../../db/models")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

const validateSpot = [
    check('address')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Street address is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('city')
      .exists({ checkFalsy: true })
      .withMessage('City is required'),
    check('state')
      .exists({ checkFalsy: true })
      .withMessage('State is required'),
      check('country')
      .exists({ checkFalsy: true })
      .withMessage('Country is required'),
      check('lat')
      .exists({ checkFalsy: true })
      .isFloat({gt: -90, lt: 90})
      .withMessage('Latitude is not valid'),
      check('lng')
      .exists({ checkFalsy: true })
      .isFloat({gt: -180, lt: 180})
      .withMessage('Longitude is not valid'),
      check('name')
      .exists({ checkFalsy: true })
      .isLength({min: 1, max: 50})
      .withMessage('Name must be less than 50 characters'),
      check('description')
      .exists({ checkFalsy: true })
      .withMessage('Description is required'),
      check('price')
      .exists({ checkFalsy: true })
      .isInt({min:1})
      .withMessage('Price per day is required'),
    handleValidationErrors
  ];

  const validateReview = [
    check('review')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Review text is required'),
      check('stars')
      .exists({ checkFalsy: true })
      .isInt({gt: 0, lt: 5.1})
      .withMessage('Stars must be an integer from 1 to 5'),
      handleValidationErrors
  ];

//   const validateBooking = [
//     check('endDate')
//       .exists({ checkFalsy: true })
//       .isAfter('startDate')
//       .withMessage('endDate cannot be on or before startDate'),
//       handleValidationErrors
//   ];
router.get('/', async (req, res, next) => {
    let spots;
    spots = await Spot.findAll({
        include: [{
            model: Review,
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating']],
        },
        {
            model: SpotImage,
            attributes: [['url', 'previewImage']],
        }],
        group: [['Spot.id','ASC']]
    })
    spots = spots.map(spot => {
        const jsonSpot = spot.toJSON();
        if (jsonSpot.Reviews[0]) {
          jsonSpot.avgRating = jsonSpot.Reviews[0].avgRating;
        } else {
          jsonSpot.avgRating = null;
        }
        delete jsonSpot.Reviews
        if (jsonSpot.SpotImages[0]) {
            jsonSpot.previewImage = jsonSpot.SpotImages[0].previewImage;
          } else {
            jsonSpot.previewImage = null;
          }
          delete jsonSpot.Reviews
          delete jsonSpot.SpotImages
        return jsonSpot;
      });
      res.json({Spots: spots});
})
router.get('/current',requireAuth, async (req, res, next) => {
    let userSpot;
    userSpot = await Spot.findAll({
        where: {
            ownerId: req.user.id
        },
        include: [{
            model: Review,
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating']],
        },
        {
            model: SpotImage,
            attributes: [['url', 'previewImage']],
        }],
        group: [['Spot.id','ASC']]
    })
    userSpot = userSpot.map(spot => {
        const jsonSpot = spot.toJSON();
        if (jsonSpot.Reviews[0]) {
          jsonSpot.avgRating = jsonSpot.Reviews[0].avgRating;
        } else {
          jsonSpot.avgRating = null;
        }
        delete jsonSpot.Reviews
        if (jsonSpot.SpotImages[0]) {
            jsonSpot.previewImage = jsonSpot.SpotImages[0].previewImage;
          } else {
            jsonSpot.previewImage = null;
          }
          delete jsonSpot.Reviews
          delete jsonSpot.SpotImages
        return jsonSpot;
      });
      res.json({Spots: userSpot});
})
router.get('/:spotId', async (req, res, next) => {
    let spotDetail;
    spotDetail = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        include: [{
            model: Review,
            attributes: [[Sequelize.fn('COUNT', Sequelize.col('review')),'numReviews'],
            [Sequelize.fn('AVG', Sequelize.col('stars')),'avgStarRating']]
        }, {
            model: User,
            as: "Owner",
            attributes: ['id','firstName','lastName']
        },
        {
            model: SpotImage,
            attributes: ['id','url','preview']
        }]
    })
    if (spotDetail.id === null) res.status(404).json({
        "message": "Spot couldn't be found"
      });
        const jsonSpot = spotDetail.toJSON();
        if (jsonSpot.Reviews[0]) {
          jsonSpot.avgStarRating = jsonSpot.Reviews[0].avgStarRating;
          jsonSpot.numReviews = jsonSpot.Reviews[0].numReviews;

        }
        delete jsonSpot.Reviews
      res.json(jsonSpot);
});
router.get('/:spotId/reviews', async (req, res, next) => {
    let userReviews;
    userReviews = await Review.findByPk(req.params.spotId,{
        include: [{
            model: User,
            attributes: ['id','firstName','lastName'],
        },
        {
            model: ReviewImage,
            attributes: ['id','url']
        }]
    })
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({
        "message": "Spot couldn't be found"
      })
      res.json({Reviews: userReviews});
})
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
    try{
    let newSpot;
    newSpot = await Spot.create(req.body)
    res.status(201).json(newSpot)
    }
    catch(e) {
        delete e.stack
        next(e)}
})
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({
        "message": "Spot couldn't be found"
      })
    const image = (await spot.createSpotImage(req.body)).toJSON()
    const {id, url, preview } = image
    res.json({
        id,
        url,
        preview
    })
})
router.post('/:spotId/reviews', requireAuth, validateReview, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({
        "message": "Spot couldn't be found"
      })
     let {review, stars} = req.body
    try {
        const newReview = (await spot.createReview({userId: req.user.id, review, stars}, req.body)).toJSON()
        res.status(201).json({
            id: newReview.id,
            userId: newReview.userId,
            spotId: req.params.spotId,
            review,
            stars,
            createdAt: newReview.createdAt,
            updatedAt: newReview.updatedAt
        })
    } catch(err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(500).json({
                message: "User already has a review for this spot"})
        }
        else {
            res.status(500).json({
            message: err.message
        })
    }
    }

})
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
    const booking = await Booking.findOne({
        where: {
            spotId: req.params.spotId,
            [Op.or]: [{startDate:{[Op.between]:[req.body.startDate,req.body.endDate]}},
            {endDate:{[Op.between]:[req.body.startDate,req.body.endDate]}}]
        },
        limit: 1
        // attributes: {
        //     include: ['id']
        // },
    });
    if (booking) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
              startDate: "Start date conflicts with an existing booking",
              endDate: "End date conflicts with an existing booking"
            }
          })
        // for (let i = 0; i < booking.length; i++) {
        //     if (req.body.startDate >= booking[i].startDate && req.body.startDate < booking[i].endDate) {
        //         return res.status(403).json({
        //             message: "Sorry, this spot is already booked for the specified dates",
        //             errors: {
        //               startDate: "Start date conflicts with an existing booking",
        //               endDate: "End date conflicts with an existing booking"
        //             }
        //           })
        //     }
        //     if (req.body.endDate < booking[i].endDate && req.body.endDate >= booking[i].startDate) {
        //         return res.status(403).json({
        //             message: "Sorry, this spot is already booked for the specified dates",
        //             errors: {
        //               startDate: "Start date conflicts with an existing booking",
        //               endDate: "End date conflicts with an existing booking"
        //             }
        //           })
        //     }
        // }
    }
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({
        "message": "Spot couldn't be found"
      })
    try {
        // const {id, spotId, userId, startDate, endDate, createdAt, updatedAt} = newBooking
        const newBooking = (await spot.createBooking(req.body)).toJSON()
        const {id, spotId, userId, startDate, endDate, createdAt, updatedAt} = newBooking
        res.status(200).json({
            // id: booking.id,
            spotId,
            userId: req.user.id,
            startDate,
            endDate,
            updatedAt,
            createdAt
        })
    } catch(err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Bad Request", // (or "Validation error" if generated by Sequelize),
                errors: {
                  endDate: "endDate cannot be on or before startDate"
                }
              })
        }
        else {
            res.status(500).json({
            message: err.message
        })
    }
    }

})
router.put('/:spotId', requireAuth, validateSpot, async (req, res, next) => {
    let updatedSpot;
    updatedSpot = await Spot.findByPk(req.params.spotId)
    if (updatedSpot === null) return res.status(404).json({
        "message": "Spot couldn't be found"
      })
    updatedSpot.update(req.body)
    res.json(updatedSpot)
});
router.delete('/:spotId', requireAuth, async (req, res, next) => {
    const results = await Spot.scope({method: ['authorization',req.user.id]}).destroy({
        where: {
            id: req.params.spotId
        }
    })
    if (results) {
        return res.json({
            "message": "Successfully deleted"
          })
    }
    res.status(404).json({
        "message": "Spot couldn't be found"
      })
})

module.exports = router;
