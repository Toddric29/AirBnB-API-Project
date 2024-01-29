const express = require('express');
const router = express.Router();
const { requireAuth } = require("../../utils/auth.js");
const { Spot, Review, SpotImage, User, Sequelize } = require("../../db/models")

router.get('/', async (req, res, next) => {
    let spots;
    spots = await Spot.findAll({
        // attributes: ['id','ownerId',[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating'], 'preview'],
        include: [{
            model: Review,
            attributes: [[Sequelize.fn('AVG', Sequelize.col('stars')),'avgRating']],
            // required: true
        },
        {
            model: SpotImage,
            attributes: [['url', 'previewImage']],
            // required: true
        }],
        group: [['Spot.id','ASC']]
    })
    res.json({Spots: spots});
})
router.get('/current',requireAuth, async (req, res, next) => {
    let spot;
    spot = await Spot.findAll({
        where: {
            ownerId: req.user.id
        }
    })
    res.json(spot);
})
router.get('/:spotId', async (req, res, next) => {
    let spot;
    spot = await Spot.findByPk(req.params.spotId, {
        //TODO: NUMREVIEWS AND AVGSTARATINGS
        include: [{
            model: SpotImage,
            attributes: ['id','url','preview']
        }, {
            model: User,
            as: "Owner",
            attributes: ['id','firstName','lastName']
        }],
    })
    res.json(spot);
})
router.post('/', requireAuth, async (req, res, next) => {
    try{
    // const { address, city, state, country, lat, lng, name, description, price} = req.body
    let newSpot;
    newSpot = await Spot.create(req.body)
    res.json(newSpot)
    }
    catch(e) {
        delete e.stack
        next(e)}
})
module.exports = router;
