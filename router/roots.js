const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const mongoose = require("mongoose");
const { isLoggedIn } = require("../middleware/auth");
const bcrypt = require('bcrypt');
router.get("/", (req, res) => {
  res.render("books/new");
});

//search books
router.get("/books",isLoggedIn, async (req, res) => {
  const searchQuery = req.query.search || "";
  const books = await Book.find({ title: new RegExp(searchQuery, "i") });
  res.render("books/index", { books, searchQuery });
});

router.get("/books/new",isLoggedIn, (req, res) => {
  res.render("books/new");
});

router.post("/books",isLoggedIn, async (req, res) => {
  await Book.create(req.body);
  res.redirect("books");
});

// Edit Book Form
router.get('/:id/edit',isLoggedIn, async (req, res) => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            return res.status(404).send('Book not found');
        }
        res.render('books/edit', { book }); // ← pass the book here!
    } catch (err) {
        res.status(500).send('Server error');
    }
});
  
  // Update Book

router.post("/books/:id/edit", isLoggedIn,async (req, res) => {
    const { id } = req.params;
    console.log("Book ID:", id); // Debugging
    // Validate the ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send("Invalid Book ID");
    }

    const { title, author, genre, publishedYear } = req.body;

    try {
        // Ensure all fields are provided
        if (!title || !author || !genre || !publishedYear) {
            return res.status(400).send("All fields are required");
        }

        // Find the book by ID and update it
        const updatedBook = await Book.findByIdAndUpdate(
            id,
            { title, author, genre, publishedYear },
            { new: true, runValidators: true }
        );

        if (!updatedBook) {
            return res.status(404).send("Book not found");
        }

        // Redirect to the book details page
        res.redirect(`/books`);
    } catch (err) {
        console.error("Error updating book:", err);
        res.status(500).send("Internal Server Error");
    }
});

  
  
  // Delete Book
  router.delete("/:id", isLoggedIn,async (req, res) => {
    try {
      await Book.findByIdAndDelete(req.params.id);
      res.redirect("/books");
    } catch (err) {
      res.status(500).send("Delete failed");
    }
  });

  

  
  
  
module.exports = router;
