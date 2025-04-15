const express = require("express");
const router = express.Router();
const Book = require("../models/book");
const User = require("../models/user");
const mongoose = require("mongoose");
const { isLoggedIn } = require("../middleware/auth");
const multer = require('multer');
const upload = multer({ dest: 'public/uploads/' });
const isAdmin = require("../middleware/isAdmin");


router.get("/", (req, res) => {
  res.render("books/welcome", { session: req.session });
});

router.get("/about", (req, res) => {
  res.render("static/about");
});


router.get("/Books", async (req, res) => {
  try {
    const books = await Book.find(); // Fetch all books from the database
    res.render("static/book", { books, session: req.session }); // Pass books and session to the template
  } catch (err) {
    console.error("Error fetching books:", err);
    res.status(500).send("Server error");
  }
});


// Search books (user-specific)
router.get("/booke", isLoggedIn, async (req, res) => {
  const searchQuery = req.query.search || "";
  const books = await Book.find({
    userId: req.session.userId,
    title: new RegExp(searchQuery, "i")
  });
  res.render("books/index", { books, searchQuery });
});

// New book form
router.get("/books/new",isAdmin, (req, res) => {
  res.render("books/new");
});

// Add new book (user-specific)
router.post("/books/new", isAdmin, upload.single("coverImage"), async (req, res) => {
    try {
        const { title, author, genre, publishedYear, dueDate,isRented,date}= req.body;
        const coverImage = req.file ? `/uploads/${req.file.filename}` : "";

        await Book.create({
            title,
            author,
            genre,
            publishedYear,
            coverImage,
            date:  date|| new Date(),
            dueDate: dueDate || null,
            userId: req.session.userId
        });

        res.redirect("/books/new");
    } catch (err) {
      res.redirect("/Admin");
        console.error("Error adding book:", err);
        res.status(500).send("Server error");
    }
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

  const { title, author, genre, publishedYear, coverImage, isRented, dueDate } = req.body;

  try {
    const updatedBook = await Book.findOneAndUpdate(
      { _id: id, userId: req.session.userId },
      {
        title,
        author,
        genre,
        publishedYear,
        coverImage,
        date: date|| new Date(),
        dueDate: dueDate || null
      },
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
        const userId = req.session.userId; // Get the logged-in user's ID
        const books = await Book.find({ userId }); // Fetch books for the logged-in user
        const recentBooks = books.slice(-5).reverse(); // Get the 5 most recent books
        
        console.log("Username from session:", req.session.username);
        
        res.render("books/dashboard", {
            user: req.session.username, // Pass the username
            bookCount: books.length, // Pass the total book count
            recentBooks, // Pass the recent books
            books // Pass all books to the template
        });
    } catch (err) {
        console.error("Error loading dashboard:", err);
        res.status(500).send("Server error");
    }
});

// Rent a book
router.post("/books/:id/rent", isLoggedIn, async (req, res) => {
    try {
        const bookId = req.params.id;

        // Validate the book ID
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
            req.flash("error", "Invalid Book ID");
            return res.redirect("/Books");
        }

        // Find the book by ID
        const book = await Book.findById(bookId);
        if (!book) {
            req.flash("error", "Book not found");
            return res.redirect("/Books");
        }

        // Check if the book is already rented
        if (book.isRented) {
            req.flash("error", "This book is already rented.");
            return res.redirect("/Books");
        }

        // Mark the book as rented
        book.isRented = true;
        book.userId = req.session.userId;
        book.date = new Date(); // Set the rental date to now
        book.dueDate = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000); // 2 weeks from now
        await book.save();

        req.flash("success", `You have successfully rented "${book.title}".`);
        res.redirect("/Books");
    } catch (err) {
        console.error("Error renting book:", err);
        req.flash("error", "An error occurred while renting the book.");
        res.redirect("/Books");
    }
});

// Admin-only route for index.ejs
router.get("/admin/index", isAdmin, (req, res) => {
    res.render("index"); // Render the index.ejs file
});

module.exports = router;

