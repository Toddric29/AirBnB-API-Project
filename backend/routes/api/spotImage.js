const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review, SpotImage, User, ReviewImage, Booking, Sequelize } = require("../../db/models")
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')


router.delete('/:imageId', requireAuth, async (req, res, next) => {
    const deletedSpotImage = await SpotImage.findOne({
        where: {
            id: req.params.imageId
        },
        include: {
            model: Spot
        }
    })
    if (deletedSpotImage === null) {
        return res.status(404).json({
            "message": "Spot Image couldn't be found"
          })
    }
    if (deletedSpotImage.Spot.ownerId === req.user.id) {
        await deletedSpotImage.destroy()
        return res.json({
            "message": "Successfully deleted"
          })
    }
    res.status(404).json({
        "message": "You don't have authorization to delete this spot image"
      })
})

module.exports = router;
