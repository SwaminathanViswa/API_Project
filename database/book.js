const mongoose = require("mongoose");

//create book schema
const BookSchema = moongoose.Schema(
  {
    ISBN: String,
    title: String,
    pubDate: String,
    language: String,
    numPage: Number,
    author: [Number],
    publication: [Number],
    category: [String]
  }
);

const BookModel = mongoose.model("Books",BookSchema);

module.exports = BookModel;
