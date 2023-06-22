const mongoose = require("mongoose");
const User = require("./User");
const Schema = mongoose.Schema;

const initialWeight = 1000;

const PostSchema = new Schema({
  author: { type: mongoose.ObjectId, ref: User },
  content: { type: String, required: true, maxLength: 128 },
  weight: { type: Number, default: initialWeight },
});

const Post = mongoose.model("Post", PostSchema);

module.exports = Post;
