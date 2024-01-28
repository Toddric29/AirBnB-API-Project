const express = require('express');
const router = express.Router();

const { Spot, Review } = require("../../db/models")

router.get('/spots', async (req, res, next) => {
    let spots;
    spots = await Spot.findAll()
    res.json(spots);
})
