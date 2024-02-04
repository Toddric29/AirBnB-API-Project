const express = require('express');
const bcrypt = require('bcryptjs');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

const validateSignup = [
    check('email')
      .exists({ checkFalsy: true })
      .isEmail()
      .withMessage('Invalid email'),
    check('username')
      .exists({ checkFalsy: true })
      .isLength({ min: 4 })
      .withMessage('Username is required'),
    check('username')
      .not()
      .isEmail()
      .withMessage('Username cannot be an email.'),
    check('firstName')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('First Name is required'),
      check('lastName')
      .exists({ checkFalsy: true })
      .notEmpty()
      .withMessage('Last Name is required'),
    check('password')
      .exists({ checkFalsy: true })
      .isLength({ min: 6 })
      .withMessage('Password must be 6 characters or more.'),
    handleValidationErrors
  ];

  router.post(
    '/',
    validateSignup,
    async (req, res) => {
      const { email, password, username, firstName, lastName } = req.body;
      const hashedPassword = bcrypt.hashSync(password);
      try{
        const user = await User.create({ email, username, hashedPassword, firstName, lastName });

        const safeUser = {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          username: user.username
        };

        await setTokenCookie(res, safeUser);

        return res.json({
          user: safeUser
        });
      } catch(err) {
        console.log(err.errors[0].message)
        if (err.errors[0].message === 'email must be unique') {
            return res
                .status(500)
                .json({
                  "message": "User already exists",
                  "errors": {
                    "email": "User with that email already exists"
                  }
                })
        }
        if (err.errors[0].message === 'username must be unique') {
          return res
              .status(500)
              .json({
                "message": "User already exists",
                "errors": {
                  "username": "User with that username already exists"
                }
              })
      }
        else {
            res
                .status(500)
                .json({
                    message: err.errors
                })
        }
    }
    }
  );

  module.exports = router;
