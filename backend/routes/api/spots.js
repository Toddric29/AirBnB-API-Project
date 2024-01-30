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
router.post('/:spotId/images', requireAuth, async (req, res, next) => {
    const spot = await Spot.findByPk(req.params.spotId);
    const image = (await spot.createSpotImage(req.body)).toJSON()
    const {id, url, preview } = image
    res.json({
        id,
        url,
        preview
    })
})
router.put('/:spotId', requireAuth, async (req, res, next) => {
    let updatedSpot;
    updatedSpot = await Spot.findByPk(req.params.spotId)
    updatedSpot.update(req.body)
    res.json(updatedSpot)
})
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
