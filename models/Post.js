const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const initialWeight = 1000;
const maxContentLength = 256;
const maxTitleLength = 64;

const PostSchema = new Schema({
  title: { type: String, maxLength: maxTitleLength },
  author: { type: mongoose.ObjectId, ref: User },
  content: { type: String, required: true, maxLength: maxContentLength },
  weight: { type: Number, default: initialWeight },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
