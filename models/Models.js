const mongoose = require("mongoose");
const User = require("./User");
const Post = require("./Post");
const Vote = require("./Vote"); 

module.exports = {
  User,
  Post,
  Vote,
};
