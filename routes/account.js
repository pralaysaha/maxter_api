const router = require('express').Router();
const jwt = require('jsonwebtoken');

const User = require('../models/user');
const config = require('../config');

router.post('/signup', (req, res, next) => {
  let user = new User();
  user.name = req.body.name;
  user.password = req.body.password;
  user.email = req.body.email;
  user.age = req.body.age;
  user.gender = req.body.gender;
  user.picture = user.gravatar();

  User.findOne({ email: req.body.email }, (err, existingUser) => {
    if (err) throw err;
    if (existingUser) {
      res.json({
        success: false,
        message: 'Account with email already exists'
      });
    } else {
      user.save();

      var token = jwt.sign({ user: user }, config.secretKey, {
        expiresIn: '7d'
      });

      res.json({
        success: true,
        message: 'JWT Token is generated',
        token: token
      });
    }
  });
});

router.post('/login', (req, res, next) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) throw err;
    if (user) {
      if (user.comparePassword(req.body.password)) {
        var token = jwt.sign({ user: user }, config.secretKey, {
          expiresIn: '7d'
        });
        res.json({
          success: true,
          message: 'JWT Token is generated',
          token: token
        });
      } else {
        res.json({
          success: false,
          message: 'Authentication failed.  Wrong Password'
        });
      }
    } else {
      res.json({
        success: false,
        message: 'Authentication failed. User not found'
      });
    }
  });
});

module.exports = router;
