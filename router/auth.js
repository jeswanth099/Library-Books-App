const express = require("express");
const router = express.Router();
const User = require("../models/user");
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

// Log in user
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && await user.comparePassword(password)) {
    req.session.userId = user._id;
    res.redirect("/books");
  } else {
    res.status(400).send("Invalid credentials");
  }
});

// Logout
router.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie("connect.sid");
    req.flash("success", "You have logged out.");
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
