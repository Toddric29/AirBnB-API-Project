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
      .isFloat({min: -90, max: 90})
      .withMessage('Latitude is not valid'),
      check('lng')
      .exists({ checkFalsy: true })
      .isFloat({min: -180, max: 180})
      .withMessage('Longitude is not valid'),
      check('name')
      .exists({ checkFalsy: true })
      .isLength({min: 1, max: 50})
      .withMessage('Name is required and must be less than 50 characters'),
      check('description')
      .exists({ checkFalsy: true })
      .isLength({min: 30, max: 500})
      .withMessage('Description must be at least 30 characters long'),
      check('price')
      .exists({ checkFalsy: true })
      .isFloat({min:0})
      .withMessage('Price per day is required and cannot be less than 0'),
      check('previewImage')
      .exists({ checkFalsy: true })
      .withMessage('A preview image is required'),
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
      .withMessage('Please enter a star rating, ranging from 1 star to 5 stars'),
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
  if (!req.query.page) {
    let spots;
    spots = await Spot.findAll({
      subQuery: false,
        include: [{
            model: Review,
            required: false,
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating']],
        },
        {
            model: SpotImage,
            required: false,
            subQuery: false,
            attributes: [['url', 'previewImage']],
        }],
        group: [['Spot.id','ASC'],['Reviews.id'],['SpotImages.id']]
    })

    spots = spots.map(spot => {
        const jsonSpot = spot.toJSON();
        if (jsonSpot.Reviews[0]) {
          parseInt(jsonSpot.price, jsonSpot.lat, jsonSpot.lng)
          const [sum, count] = jsonSpot.Reviews.reduce(
            (accumulator, review) => {
              accumulator[0] += review.avgRating;
              accumulator[1]++;

              return accumulator;
            },
            [0, 0]
          );
          jsonSpot.avgRating = sum / count
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
      return res.json({
        Spots: spots
      });
  }
  if (req.query.page) {
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
    let filteredSpots;
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

    filteredSpots = await Spot.findAll({
      subQuery: false,
      where: where,
        include: [{
            model: Review,
            required: false,
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating']],
        },
        {
            model: SpotImage,
            required: false,
            subQuery: false,
            attributes: [['url', 'previewImage']],
        }],
        group: [['Spot.id'],['SpotImages.id'],['Reviews.id']],
        ...pagination
    })
    if (filteredSpots[0].id === null) {
      return res.status(403).json({
        message: 'No spots meet this criteria'
      })
    }
    filteredSpots = filteredSpots.map(filteredSpot => {
        const jsonSpot = filteredSpot.toJSON();
        parseInt(jsonSpot.price, jsonSpot.lat, jsonSpot.lng)
        if (jsonSpot.Reviews[0]) {
          jsonSpot.avgRating = parseFloat(jsonSpot.Reviews[0].avgRating);
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
      return res.json({Spots: filteredSpots, page, size});
  }
})


router.get('/current',requireAuth, async (req, res, next) => {
    let userSpot;
    userSpot = await Spot.findAll({
      subQuery: false,
        where: {
            ownerId: req.user.id
        },
        include: [{
            model: Review,
            subQuery: false,
            required: false,
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating']],
        },
        {
            model: SpotImage,
            required: false,
            attributes: [['url', 'previewImage']],
        }],
        group: [['Spot.id'], ['Reviews.id'], ['SpotImages.id']]
    })
    userSpot = userSpot.map(spot => {
        const jsonSpot = spot.toJSON();
        if (jsonSpot.Reviews[0]) {
          jsonSpot.avgRating = parseFloat(jsonSpot.Reviews[0].avgRating);
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
      res.json({
        Spots: userSpot});
})
router.get('/:spotId', async (req, res, next) => {
    let spotDetail;
    spotDetail = await Spot.findOne({
        where: {
            id: req.params.spotId
        },
        include: [
        //   {
        //     model: Review,
        //     required: false,
        //     attributes: [[Sequelize.fn('COUNT', Sequelize.col('review')),'numReviews'],
        //     [Sequelize.fn('AVG', Sequelize.col('stars')),'avgStarRating']]
        // },
         {
            model: User,
            as: "Owner",
            required: false,
            attributes: ['id','firstName','lastName']
        },
        {
            model: SpotImage,
            required: false,
            attributes: ['id','url','preview']
        }],
        // group: [['Spot.id'],['Reviews.id'],['Owner.id'],['SpotImages.id']]
    })

    if (spotDetail === null) return res.status(404).json({
      message: "Spot couldn't be found"
    });
    const reviewCount = await spotDetail.countReviews()
    const reviewSum = await Review.sum('stars', {where: {spotId: req.params.spotId}})
        const jsonSpot = spotDetail.toJSON();
        jsonSpot.numReviews = reviewCount===0 ? null : reviewCount
        jsonSpot.avgStarRating = reviewCount === 0 ? null : (reviewSum / reviewCount)
        spotDetail.lat = parseFloat(spotDetail.lat);
        spotDetail.lng = parseFloat(spotDetail.lng);
        spotDetail.price = parseFloat(spotDetail.price);
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
            required: false,
            attributes: ['id','firstName','lastName'],
        },
        {
            model: ReviewImage,
            required: false,
            attributes: ['id','url']
        }]
    })
    const spot = await Spot.findByPk(req.params.spotId);
    if (!spot) return res.status(404).json({
        "message": "Spot couldn't be found"
      })
      res.json({Reviews: userReviews});
});
router.get('/:spotId/bookings', requireAuth, async (req, res, next) => {
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) return res.status(404).json({
      message: "Spot couldn't be found"
    })
  let userBookings;
  userBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId
    },
    attributes: ['spotId','startDate','endDate']
  });
  let ownerBookings;
  ownerBookings = await Booking.findAll({
    where: {
      spotId: req.params.spotId
    },
    include: {
      model: User,
      required: false,
      attributes: ['id','firstName','lastName']
    }
  });
  if (req.user.id === spot.ownerId) {
      return res.json({Bookings: ownerBookings})
    }
    res.json({Bookings: userBookings})
})
router.post('/', requireAuth, validateSpot, async (req, res, next) => {
  let {address, city, state, country, lat, lng, name, description, price, previewImage, images} = req.body
    try{
    let newSpot;
    newSpot = await Spot.create({
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: parseFloat(price)
    })
    if (previewImage) {
      console.log(typeof previewImage)
      await newSpot.createSpotImage({
        url: previewImage,
        preview: true
      })
    }
    if (images) {
      for (const image of images) {
        if (!image.url) {
          continue
        }
        await newSpot.createSpotImage({
          url: image.url,
          preview: false
        })
      }
    }
    return res.status(201).json({
      id: parseInt(newSpot.id),
      ownerId: req.user.id,
      address,
      city,
      state,
      country,
      lat: parseFloat(lat),
      lng: parseFloat(lng),
      name,
      description,
      price: parseFloat(price)
    })
    }
    catch(e) {
        delete e.stack
        next(e)}
})
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot === null) return res.status(404).json({
        "message": "Spot couldn't be found"
      })
    if (spot.ownerId !== req.user.id) {
      return res.status(403).json({
        message: 'Forbidden'
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
        return res.status(201).json({
            id: newReview.id,
            userId: newReview.userId,
            spotId: parseInt(req.params.spotId),
            review,
            stars: parseInt(stars),
            createdAt: newReview.createdAt,
            updatedAt: newReview.updatedAt
        })
    } catch(err) {
        if (err.name === 'SequelizeUniqueConstraintError') {
            return res.status(500).json({
                message: "User already has a review for this spot"})
        }
        else {
          console.log(err.message)
            res.status(500).json({
            message: err.message
        })
    }
    }

})
router.post('/:spotId/bookings', requireAuth, async (req, res, next) => {
let { startDate, endDate } = req.body;
startDate = new Date(startDate);
endDate = new Date(endDate);
    const booking = await Booking.findOne({
        where: {
            spotId: req.params.spotId,
            [Op.or]: [{startDate:{[Op.between]:[startDate,endDate]}},
            {endDate:{[Op.between]:[startDate,endDate]}},
          {[Op.and]:{startDate:{[Op.lte]: startDate},endDate:{[Op.gte]:endDate}}}]
        },
        limit: 1
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
    const spot = await Spot.findByPk(req.params.spotId);
    if (spot === null) return res.status(404).json({
        message: "Spot couldn't be found"
      })
    if (req.user.id === spot.ownerId) {
      return res.status(403).json({
        message: "Forbidden"
      })
    }
    try {
        const newBooking = (await Booking.create({userId: req.user.id, spotId: parseInt(req.params.spotId),endDate, startDate})).toJSON()
        res.status(200).json(
            newBooking)
    } catch(err) {
        if (err.name === 'SequelizeValidationError') {
            return res.status(400).json({
                message: "Bad Request",
                errors: {
                  endDate:  "endDate cannot be on or before startDate"
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
        return res.status(403).json({
          message: 'Forbidden'
        })
      }
      const previewImage = req.body.previewImage
      const images = req.body.images
      delete req.body.previewImage
      delete req.body.images
    await updatedSpot.update(req.body)
    console.log(updatedSpot)
    await SpotImage.destroy({where: {spotId: updatedSpot.id}})
    if (previewImage) {
      await updatedSpot.createSpotImage({
        url: previewImage,
        preview: true
      })
    }
    if (images) {
      for (const image of images) {
        if (!image.url) {
          continue
        }
        await updatedSpot.createSpotImage({
          url: image.url,
          preview: false
        })
      }
    }
    res.json(updatedSpot)
});
router.delete('/:spotId', requireAuth, async (req, res, next) => {
  let spot = await Spot.findByPk(req.params.spotId)
  if (spot === null) {
    return res.status(404).json({
      "message": "Spot couldn't be found"
    })
  }
    const results = await Spot.scope({method: ['authorization',req.user.id]}).destroy({
        where: {
            id: req.params.spotId
        }
    })
    if (results) {
        return res.json({
            message: "Successfully deleted"
          })
    }
      return res.status(403).json({
        message: "Forbidden"
      })
})

module.exports = router;
