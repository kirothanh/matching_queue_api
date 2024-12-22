const express = require('express');
const cors = require('cors')
const app = express();
const session = require('express-session');
const passport = require('passport');
require("./utils/passport");


app.use(cors())
// Body Parse
app.use(express.json()); //Nhận body từ json
app.use(express.urlencoded({ extended: true })) //Nhận body từ urlencoded
app.use(express.static('public'));

// Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());




// Route
const api_V1 = require('./routes/api');
app.use('/api', api_V1);

module.exports = app