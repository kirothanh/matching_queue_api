const express = require('express');
const http = require('http');
const socketIO = require("socket.io");
const session = require('express-session');
const passport = require('passport');
const socketHandler = require("./utils/socketHandler");
require("./utils/passport");
require("dotenv").config();
const cors = require('cors')
const app = express();

const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

// Đặt io thành global
global._io = io;

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true
}));

// Body Parse
app.use(express.json()); //Nhận body từ json
app.use(express.urlencoded({ extended: true })) //Nhận body từ urlencoded
app.use(express.static('public'));

socketHandler(io)

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

module.exports = { app, server };