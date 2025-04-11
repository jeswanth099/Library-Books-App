const express = require("express");
const router = express.Router();
const User = require("../models/user");


// middleware/auth.js
function isLoggedIn(req, res, next) {
    if (req.session && req.session.userId) {
      return next();
    }
    res.redirect("/login");
  }
  
  module.exports = { isLoggedIn };
  