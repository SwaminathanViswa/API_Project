const mongoose = require("mongoose");

//create publication schema
const PublicationSchema = moongoose.Schema(
  {
    id:Number,
    name:String,
    books:[String]
  }
);

const PublicationModel = mongoose.model("Books",PublicationSchema);

module.exports = PublicationModel;
