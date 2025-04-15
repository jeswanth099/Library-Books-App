const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
    title: { type: String },
    author: { type: String },
    genre: { type: String  },
    publishedYear: { type: Number },
    coverImage: String,
    date: Date,
    dueDate: Date,
    isRented: { type: Boolean },
    rentedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User",  }
});

module.exports = mongoose.model("Book", bookSchema);
