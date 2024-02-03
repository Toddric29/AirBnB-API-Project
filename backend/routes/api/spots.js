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
      .isFloat({gte: -90, lte: 90})
      .withMessage('Latitude is not valid'),
      check('lng')
      .exists({ checkFalsy: true })
      .isFloat({gte: -180, lte: 180})
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
      .isFloat({min:0})
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

  const validateQuery = [
    check('page')
    .exists({ checkFalsy: true })
    .isInt({min:1, max:10})
      .withMessage('Page must be greater than or equal to 1'),
    check('size')
      .exists({ checkFalsy: true })
      .isInt({min:1, max:20})
      .withMessage('Size must be greater than or equal to 1'),
    check('maxLat')
      .exists({ checkFalsy: true })
      .isFloat({gte: -90, lte: 90})
      .withMessage('Maximum latitude is invalid'),
      check('minLat')
      .exists({ checkFalsy: true })
      .isFloat({gte: -90, lte: 90})
      .withMessage('Minimum latitude is invalid'),
    check('maxLng')
      .exists({ checkFalsy: true })
      .isFloat({gte: -180, lte: 180})
      .withMessage('Maximum longitude is invalid'),
    check('minLng')
      .exists({ checkFalsy: true })
      .isFloat({gte: -180, lte: 180})
      .withMessage('Minimum longitude is invalid'),
    check('minPrice')
      .exists({ checkFalsy: true })
      .isFloat({min: 0})
      .withMessage('Minimum price must be greater than or equal to 0'),
    check('maxPrice')
      .exists({ checkFalsy: true })
      .isFloat({min: 0})
      .withMessage('Maximum price must be greater than or equal to 0'),
      handleValidationErrors
  ];

router.get('/', async (req, res, next) => {
  if (req.query === '{}') {
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
      return res.json({Spots: spots});
  }
  if (req.query !== '{}') {
    let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query
    if (page < 1 || size < 1 || maxLat > 90 || minLat < -90 || maxLat < -90
      || minLat > 90 || minLng > 180 || maxLng < -180 || maxLng > 180
      || minLng < -180 || minPrice < 0 || maxPrice < 0 ) {
        return res.status(400).json({
            message: "Bad Request",
            errors: {
              page: "Page must be greater than or equal to 1",
              size: "Size must be greater than or equal to 1",
              maxLat: "Maximum latitude is invalid",
              minLat: "Minimum latitude is invalid",
              minLng: "Maximum longitude is invalid",
              maxLng: "Minimum longitude is invalid",
              minPrice: "Minimum price must be greater than or equal to 0",
              maxPrice: "Maximum price must be greater than or equal to 0"
          }
        })
      }
    size = Math.min(Math.max(1, parseInt(size || 20)),20);
    page = Math.min(Math.max(1, parseInt(page || 1)), 10);

    const pagination = {};

    if (size >= 1 && page >= 1) {
        pagination.limit = size;
        pagination.offset = size * (page - 1);
    }
    let spots;
  const key = [Op.and];

    const where = {
      lat: {
        [Op.and]: []
      },
      lng: {
        [Op.and]: []
      },
      price: {
        [Op.and]: []
      }
    };

    if (minLat) {
      where.lat[Op.and].push({[Op.gte] : minLat});
    }
    if (maxLat) {
      where.lat[Op.and].push({[Op.lte] : maxLat});
    }
    if (minLng) {
      where.lng[Op.and].push({[Op.gte] : minLng});
    }
    if (maxLng) {
      where.lng[Op.and].push({[Op.lte] : maxLng});
    }
    if (minPrice) {
      where.price[Op.and].push({[Op.gte] : Math.max(0, minPrice)});
    }
    if (maxPrice) {
      where.price[Op.and].push({[Op.lte] : Math.max(0, maxPrice)});
    }

    spots = await Spot.findAll({
      where: where /*{
        lat: {
          [Op.between]: [minLat,maxLat]
        },
        lng: {
          [Op.between]: [minLng,maxLng]
        },
        price: {
          [Op.between]: [minPrice,maxPrice]
        },
        description: {
          [Op.and]: []
        }
      }*/,
        include: [{
            model: Review,
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating']],
        },
        {
            model: SpotImage,
            attributes: [['url', 'previewImage']],
        }],
        group: [['Spot.id','ASC']],
        ...pagination
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
      res.json({Spots: spots, page, size});
  }
})

// router.get('/', validateQuery, async (req, res, next) => {
//   let {page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query
//   size = Math.min(Math.max(1, parseInt(size || 20)),20);
//   page = Math.min(Math.max(1, parseInt(page || 1)), 10);

//   const pagination = {};

//   if (size >= 1 && page >= 1) {
//       pagination.limit = size;
//       pagination.offset = size * (page - 1);
//   }
//   let spots;
// const key = [Op.and];

//   const where = {
//     lat: {
//       [Op.and]: []
//     },
//     lng: {
//       [Op.and]: []
//     },
//     price: {
//       [Op.and]: []
//     }
//   };

//   if (minLat) {
//     where.lat[Op.and].push({[Op.gte] : minLat});
//   }
//   if (maxLat) {
//     where.lat[Op.and].push({[Op.lte] : maxLat});
//   }
//   if (minLng) {
//     where.lng[Op.and].push({[Op.gte] : minLng});
//   }
//   if (maxLng) {
//     where.lng[Op.and].push({[Op.lte] : maxLng});
//   }
//   if (minPrice) {
//     where.price[Op.and].push({[Op.gte] : Math.max(0, minPrice)});
//   }
//   if (maxPrice) {
//     where.price[Op.and].push({[Op.lte] : Math.max(0, maxPrice)});
//   }

//   spots = await Spot.findAll({
//     where: where /*{
//       lat: {
//         [Op.between]: [minLat,maxLat]
//       },
//       lng: {
//         [Op.between]: [minLng,maxLng]
//       },
//       price: {
//         [Op.between]: [minPrice,maxPrice]
//       },
//       description: {
//         [Op.and]: []
//       }
//     }*/,
//       include: [{
//           model: Review,
//           attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating']],
//       },
//       {
//           model: SpotImage,
//           attributes: [['url', 'previewImage']],
//       }],
//       group: [['Spot.id','ASC']],
//       ...pagination
//   })
//   spots = spots.map(spot => {
//       const jsonSpot = spot.toJSON();
//       if (jsonSpot.Reviews[0]) {
//         jsonSpot.avgRating = jsonSpot.Reviews[0].avgRating;
//       } else {
//         jsonSpot.avgRating = null;
//       }
//       delete jsonSpot.Reviews
//       if (jsonSpot.SpotImages[0]) {
//           jsonSpot.previewImage = jsonSpot.SpotImages[0].previewImage;
//         } else {
//           jsonSpot.previewImage = null;
//         }
//         delete jsonSpot.Reviews
//         delete jsonSpot.SpotImages
//       return jsonSpot;
//     });
//     res.json({Spots: spots, page, size});
// })

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
    userReviews = await Review.findAll({
      where: {
        spotId: req.params.spotId
      },
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
});
router.get('/:spotId/bookings', async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({
      "message": "Spot couldn't be found"
    })
  let userBookings;
  userBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId
    },
    attributes: ['spotId','startDate','endDate']
  })
  let ownerBookings;
  ownerBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId
    },
    include: {
      model: User,
      attributes: ['id','firstName','lastName']
    }
  })
    if (req.user.id === ownerBookings[0].userId) {
      return res.json({Bookings: ownerBookings})
    }
    res.json({Bookings: userBookings})
})
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  let {address, city, state, country, lat, lng, name, description, price} = req.body
    try{
    let newSpot;
    newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price
    })
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
    if (spot.ownerId !== req.user.id) {
      return res.status(404).json({
        message: 'You do not have authorization to modify this spot'
      })
    }
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
        limit: 1,
        attributes: {
            include: ['userId']
        },
    });
    if (booking) {
        return res.status(403).json({
            message: "Sorry, this spot is already booked for the specified dates",
            errors: {
              startDate: "Start date conflicts with an existing booking",
              endDate: "End date conflicts with an existing booking"
            }
          })
    }
    let value = 3;
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({
        "message": "Spot couldn't be found"
      })
    try {
      const {startDate, endDate} = req.body
        const newBooking = (await spot.createBooking({userId: req.user.id, endDate, startDate})).toJSON()
        value++
        res.status(200).json({
            id: value,
            spotId: newBooking.spotId,
            userId: req.user.id,
            startDate,
            endDate,
            updatedAt: newBooking.updatedAt,
            createdAt: newBooking.createdAt
        })
    } catch(err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Bad Request", // (or "Validation error" if generated by Sequelize),
                errors: {
                  endDate:  err.message//"endDate cannot be on or before startDate"
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
      if (updatedSpot.ownerId !== req.user.id) {
        return res.status(404).json({
          message: 'You do not have authorization to modify this spot'
        })
      }
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