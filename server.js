/*Include the dependencies */

const express = require('express');
const morgan = require('morgan'); // http logger - middleware
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const config = require('./config');
const userRoute = require('./routes/account');

const app = express();

mongoose.connect(
  config.databse,
  err => {
    if (err) {
      console.log(err);
    } else {
      console.log('Connected to the database');
    }
  }
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(morgan('dev'));
app.use(cors());

app.use('/api/accounts', userRoute);

app.get('/', (req, res, next) => {
  res.json({
    Message: 'Use /api route'
  });
});

app.listen(config.port, err => {
  console.log('Api is running in ' + config.port);
});
