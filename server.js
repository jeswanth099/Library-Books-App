const express = require("express");
require('dotenv').config();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Book = require("./models/book");
const path = require('path');


const app = express();

const connectDB = async () => {
  await mongoose.connect("mongodb://localhost:27017/bookDB", () => {
  console.log('connected to db');
  });
  };
// Database Connection
/*mongoose.connect('mongodb://localhost:27017/bookDB')
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB connection error:", err));*/


// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));


 


// Routes

app.get('/books/new', (req, res) => {
  res.sendFile(path.join(__dirname, 'views'));
});


console.log('Views path:', app.get('views'));



app.get("/", (req, res) => {
  res.render("books/new");
});

app.get("/edit", (req, res) => {
  res.render("books/edit");
});

app.get("/index", (req, res) => {
  res.render("books/index");
});


app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.render("books/index", { books });
});

app.get("/books/new", (req, res) => {
  res.render("books/new");
});

app.post("/books", async (req, res) => {
  await Book.create(req.body);
  res.redirect("books");
});

// Edit Book Form
app.get("/books/:id/edit", async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render("books/edit", { book });
  });
  
  // Update Book
  app.put("/books/:id", async (req, res) => {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("books");
  });
  
  // Delete Book
  app.delete("/books/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("books");
  });

  app.get("/books", async (req, res) => {
    const searchQuery = req.query.search || "";
    const books = await Book.find({ title: new RegExp(searchQuery, "i") });
    res.render("books/index", { books });
  });
  
  

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
