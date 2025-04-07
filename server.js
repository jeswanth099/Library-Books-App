const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const Book = require("./models/book");

const app = express();

// Database Connection
mongoose.connect("mongodb://localhost:27017/bookDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
//app.set("view engine", "ejs");

// Routes

app.get("/", async (req, res) => {
    const books = await Book.find();
    res.render("./views/books/index", { books });
  });
app.get("/books", async (req, res) => {
  const books = await Book.find();
  res.render("./views/books/index", { books });
});

app.get("/books/new", (req, res) => {
  res.render("./views/books/new");
});

app.post("/books", async (req, res) => {
  await Book.create(req.body);
  res.redirect("./views/books");
});

// Edit Book Form
app.get("/books/:id/edit", async (req, res) => {
    const book = await Book.findById(req.params.id);
    res.render("./views/books/edit", { book });
  });
  
  // Update Book
  app.put("/books/:id", async (req, res) => {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("./views/books");
  });
  
  // Delete Book
  app.delete("/books/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("./views/books");
  });

  app.get("/books", async (req, res) => {
    const searchQuery = req.query.search || "";
    const books = await Book.find({ title: new RegExp(searchQuery, "i") });
    res.render(",.views/books/index", { books });
  });
  
  

// Start Server
app.listen(3000, () => console.log("Server running on http://localhost:3000"));
