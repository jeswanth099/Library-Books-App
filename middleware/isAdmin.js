const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");


// middleware/auth.js
function isAdmin(req, res, next) {
    if (req.session && req.session.role === "admin") {
        return next(); // Allow access if the user is an admin
    }
    res.status(403).send("Access denied. Admins only.");
}

module.exports = isAdmin;
