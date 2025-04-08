const express = require("express");
const router = express.Router();
const Book = require("../models/book");


router.get("/", (req, res) => {
  res.render("books/new");
});

router.get("/edit", (req, res) => {
  res.render("books/edit");
});

router.get("/index", (req, res) => {
  res.render("books/index");
});

router.get("/books", async (req, res) => {
  const books = await Book.find();
  res.render("books/index", { books });
});

router.get("/books/new", (req, res) => {
  res.render("books/new");
});

router.post("/books", async (req, res) => {
  await Book.create(req.body);
  res.redirect("books");
});

// Edit Book Form
// Assuming you have a Mongoose model called Book
router.get('/books/:id/edit', async (req, res) => {
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
  router.put("/books/:id", async (req, res) => {
    await Book.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("books");
  });
  
  // Delete Book
  router.delete("/books/:id", async (req, res) => {
    await Book.findByIdAndDelete(req.params.id);
    res.redirect("books");
  });

  router.get("/books", async (req, res) => {
    const searchQuery = req.query.search || "";
    const books = await Book.find({ title: new RegExp(searchQuery, "i") });
    res.render("books/index", { books });
  });
module.exports = router;
