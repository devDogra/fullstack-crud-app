const mongoose = require("mongoose");
const VoteSchema = require("./Vote");
const Schema = mongoose.Schema;

const initialWeight = 1000;
const maxContentLength = 256;
const maxTitleLength = 64;

const PostSchema = new Schema({
  title: { type: String, maxLength: maxTitleLength },
  author: { type: Schema.Types.ObjectId, ref: mongoose.model('User') },
  content: { type: String, required: true, maxLength: maxContentLength },
  votes: { type: [VoteSchema], default: []}
});


module.exports = PostSchema;
