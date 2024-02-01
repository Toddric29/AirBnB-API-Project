const router = require('express').Router();
const { restoreUser } = require("../../utils/auth.js");
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js');
const reviewRouter = require('./review.js');
const bookingRouter = require('./bookings.js')



router.use(restoreUser);



router.use('/session', sessionRouter);
router.use('/spots', spotsRouter);
router.use('/users', usersRouter);
router.use('/reviews', reviewRouter);
router.use('/bookings', bookingRouter);



router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
