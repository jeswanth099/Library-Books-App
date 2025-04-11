const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const mongoose = require("mongoose");
const { isLoggedIn } = require("../middleware/auth");

router.get("/", (req, res) => {
  res.render("books/home");
});

// Search books (user-specific)
router.get("/books", isLoggedIn, async (req, res) => {
  const searchQuery = req.query.search || "";
  const books = await Book.find({
    userId: req.session.userId,
    title: new RegExp(searchQuery, "i")
  });
  res.render("books/index", { books, searchQuery });
});

// New book form
router.get("/books/new", isLoggedIn, (req, res) => {
  res.render("books/new");
});

// Add new book (user-specific)
router.post("/books", isLoggedIn, async (req, res) => {
  await Book.create({ ...req.body, userId: req.session.userId });
  res.redirect("/books");
});

// Edit book form (check ownership)
router.get("/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const book = await Book.findOne({ _id: req.params.id, userId: req.session.userId });
    if (!book) return res.status(404).send("Book not found or access denied");
    res.render("books/edit", { book });
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Update book (check ownership)
router.post("/books/:id/edit", isLoggedIn, async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send("Invalid Book ID");

  const { title, author, genre, publishedYear } = req.body;

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: id, userId: req.session.userId },
      { title, author, genre, publishedYear },
      { new: true, runValidators: true }
    );
    if (!updatedBook) return res.status(404).send("Book not found or access denied");
    res.redirect("/books");
  } catch (err) {
    console.error("Error updating book:", err);
    res.status(500).send("Internal Server Error");
  }
});

// Delete book (check ownership)
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const deleted = await Book.findOneAndDelete({ _id: req.params.id, userId: req.session.userId });
    if (!deleted) return res.status(404).send("Book not found or access denied");
    res.redirect("/books");
  } catch (err) {
    res.status(500).send("Delete failed");
  }
});

// Dashboard route
router.get("/dashboard", isLoggedIn, async (req, res) => {
  try {
    const userId = req.session.userId;
    const books = await Book.find({ userId });

    res.render("books/dashboard", {
      user: req.session.username,
      bookCount: books.length,
      recentBooks: books.slice(-5).reverse() // Get the 5 most recent
    });
  } catch (err) {
    res.status(500).send("Error loading dashboard");
  }
});

module.exports = router;

