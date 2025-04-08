const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Book = require("./models/book");
const path = require('path');


const app = express();

// Database Connection
mongoose.connect('mongodb://localhost:27017/bookDB')
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Import Routes
app.use(require("./router/roots"));

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
