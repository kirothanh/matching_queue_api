const express = require('express');
const app = express();

app.use(express.static('public'));

const api_V1 = require('./routes/api');

// Body Parse
app.use(express.json()); //Nhận body từ json
app.use(express.urlencoded(true)) //Nhận body từ urlencoded

// Route
app.use('/api', api_V1);

module.exports = app