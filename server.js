const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Book = require("./models/book");
const User = require("./models/user");
const Admin = require("./models/admin");
const path = require('path');
const session = require("express-session");

const app = express();

// Database Connection
mongoose.connect('mongodb://localhost:27017/bookDB')
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

  app.use(session({
    secret: 'library-secret',
    resave: false,
    saveUninitialized: false
  }));

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public"));
app.use(express.static(path.join(__dirname, 'public')));


const flash = require("connect-flash");

app.use(session({
  secret: "secretkey123", // change this for production
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Set locals for every view
app.use((req, res, next) => {
  res.locals.currentUser = req.session.username;
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

// Import Routes
const authRoutes = require("./router/auth");
app.use(authRoutes);
app.use("/", authRoutes);

app.use(require("./router/roots"));

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
