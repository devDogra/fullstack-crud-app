const mongoose = require("mongoose");


const UserSchema = require("./User");
const User = mongoose.model("User", UserSchema);

const VoteSchema = require("./Vote");

const PostSchema = require("./Post");
const Post = mongoose.model("Post", PostSchema);

const Vote = mongoose.model('Vote', VoteSchema); 


module.exports = {
  User,
  Post,
  Vote,
};
