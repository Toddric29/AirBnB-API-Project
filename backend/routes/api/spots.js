const express = require('express');
const router = express.Router();

const { Spot, Review, SpotImage, User } = require("../../db/models")

router.get('/', async (req, res, next) => {
    let spots;
    spots = await Spot.findAll({
        attribute: ['address', 'city'],
        include: {
            model: Review,
            attribute: ['stars']
        }
    })
    res.json({Spots: spots});
})
router.get('/current', async (req, res, next) => {
    let spot;
    // spot = await Spot.findByPk(req.params.spotId)
    res.json(spot);
})
router.get('/:spotId', async (req, res, next) => {
    let spot;
    spot = await Spot.findByPk(req.params.spotId, {
        include: {
            model: SpotImage
        },
        include: {
            model: User
        }
    })
    res.json(spot);
})
router.post('/', async (req, res, next) => {
    const { address, city, state, country, lat, lng, name, description, price} = req.body
    let newSpot;
    newSpot = await Spot.create(req.body)
    res.json(newSpot)
})
module.exports = router;
