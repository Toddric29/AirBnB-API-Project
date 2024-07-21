const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review, SpotImage, User, Sequelize, ReviewImage } = require("../../db/models")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

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
router.get('/current',requireAuth, async (req, res, next) => {
    let userReviews;
    userReviews = await Review.findAll({
        where: {
            userId: req.user.id
        },
        include: [{
            model: User,
            required: false,
            attributes: ['id','firstName','lastName'],
        },
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
        },
        {
            model: ReviewImage,
            required: false,
            attributes: ['id','url']
        }]
    })
    userReviews = userReviews.map(userReview => {
        const jsonSpot = userReview.toJSON();
        if (jsonSpot.Spot.SpotImages[0]) {
            jsonSpot.previewImage = jsonSpot.Spot.SpotImages[0].previewImage;
          } else {
            jsonSpot.previewImage = null;
          }
          delete jsonSpot.Spot.SpotImages
        return jsonSpot;
      });
      res.json({Reviews: userReviews});
})

router.post('/:reviewId/images', requireAuth, async (req, res, next) => {
    const review = await Review.findByPk(req.params.reviewId);
    if (!review) return res.status(404).json({
        message: "Review couldn't be found"
      })
      if (review.userId !== req.user.id) {
        return res.status(403).json({
          message: 'Forbidden'
        })
    }
    const count = await review.countReviewImages();
    if (count > 9 ) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached"
          })
    }
      const image = (await review.createReviewImage(req.body)).toJSON()
      const {id, url} = image
      res.json({
          id,
          url
      })
});

router.put('/:reviewId', requireAuth, validateReview, async (req, res, next) => {
    let updatedReview;
    updatedReview = await Review.findByPk(req.params.reviewId)
    if (updatedReview === null) return res.status(404).json({
        message: "Review couldn't be found"
      })
      if (updatedReview.userId !== req.user.id) {
        return res.status(403).json({
          message: 'Forbidden'
        })
    }
    updatedReview.update(req.body)
    res.json(updatedReview)
});

router.delete('/:reviewId', requireAuth, async (req, res, next) => {
    let deletedReview;
    deletedReview = await Review.findByPk(req.params.reviewId)
    if (!deletedReview) return res.status(404).json({
        message: "Review couldn't be found"
      })
    if (deletedReview.userId !== req.user.id) {
        return res.status(403).json({
          message: 'Forbidden'
        })
    }
    if (deletedReview) {
        deletedReview.destroy()
        return res.json({
            message: "Successfully deleted"
          })
    }
})
module.exports = router;
