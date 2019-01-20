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

module.exports = router;
