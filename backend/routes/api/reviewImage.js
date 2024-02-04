const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review, SpotImage, User, ReviewImage, Booking, Sequelize } = require("../../db/models")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')

router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const deletedReviewImage = await ReviewImage.findOne({
        where: {
            id: req.params.imageId
        },
        include: {
            model: Review,
            required: false
        }
    })
    if (deletedReviewImage === null) {
        return res.status(404).json({
            message: "Review Image couldn't be found"
          })
    }
    if (deletedReviewImage.Review.userId === req.user.id) {
        await deletedReviewImage.destroy()
        return res.json({
            message: "Successfully deleted"
          })
    }
    res.status(403).json({
        message: "You don't have authorization to delete this spot image"
      })
})

module.exports = router;
