const mongoose = require("mongoose");
const { Schema } = mongoose;

const BookSchema = new Schema({
    title: { type: String, required: true },
    commentcount: { type: Number, min: 0 },
    comments: { type: Array }
});
const Book = mongoose.model("Book", BookSchema);

exports.Book = Book;