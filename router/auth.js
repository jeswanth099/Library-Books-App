const express = require("express");
const router = express.Router();
const User = require("../models/user");
const isAdmin = require("../models/admin");
const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

// Show register form
router.get("/register", (req, res) => {

  res.render("auth/register");
});

// Register user

router.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            req.flash("error", "Username already exists");
            return res.redirect("/register");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();

        req.flash("success", "User registered successfully");
        res.redirect("/login");
    } catch (err) {
        console.error("Error creating user:", err);
        req.flash("error", "Error creating user");
        res.redirect("/register");
    }
});

// Show login form
router.get("/login", (req, res) => {
  res.render("auth/login");
});

router.get("/admin", (req, res) => {
    res.render("auth/admin");
  });
  
// Log in user
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user || !(await user.comparePassword(password))) {
            req.flash("error", "Invalid username or password");
            return res.redirect("/login");
        }

        req.session.userId = user._id;
        req.session.username = user.username;
        req.user = user; // Attach the user object to the request
        req.flash("success", "Logged in successfully");
        res.redirect("/dashboard");
    } catch (err) {
        console.error("Error logging in:", err);
        req.flash("error", "An error occurred during login");
        res.redirect("/login");
    }
});
// admin

router.post("/admin", async (req, res) => {
  const { username, password } = req.body;

  try {
          
         const user = await Admin.findOne({ username });
         if (!user || !(await user.comparePassword(password))) {
          req.flash("error", "Invalid username or password");
          return res.redirect("/login");
      }

      req.session.userId = user._id;
      req.session.username = user.username;
      req.user = user; // Attach the user object to the request
      req.flash("success", "Logged in successfully");
      res.redirect("/books/new");
  } catch (err) {
      console.error("Error logging in:", err);
      req.flash("error", "An error occurred during login");
      res.redirect("/books/new");
  }
});

router.get("/admin/index", isAdmin, (req, res) => {
    res.render("/books/new"); // Render the index.ejs file
});

// Logout Route
router.get("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.redirect("/dashboard");
        }
        res.redirect("/login");
    });
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.redirect("/dashboard");
        }
        res.redirect("/login");
    });
});

// Delete account
router.post("/delete-account", async (req, res) => {
  if (!req.session.userId) return res.redirect("/login");
  await User.findByIdAndDelete(req.session.userId);
  req.session.destroy(() => {
    res.redirect("/register");
  });
});

module.exports = router;
