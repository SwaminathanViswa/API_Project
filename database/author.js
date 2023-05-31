const mongoose = require("mongoose");

//create author schema
const AuthorSchema = moongoose.Schema(
  {
    id:Number,
    name:String,
    books:[String]
  }
);

const AuthorModel = mongoose.model("Books",AuthorSchema);

module.exports = AuthorModel;
