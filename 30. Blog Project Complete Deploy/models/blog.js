const { Schema, model } = require("mongoose");

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    coverImageURL: {
      type: String,
      required: false,
    },
    createdBy: {
      type: Schema.Types.ObjectId, //store mongo db id e.g:  _id
      ref: "user", //ye created by  user ko reference krey ga metlab forgin key
    },
  },
  { timestamps: true }
);

const Blog = model("Blog", blogSchema);

module.exports = Blog;
