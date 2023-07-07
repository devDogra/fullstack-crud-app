const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

// const {User, Post} = require("./Models.js");
const User = require("./User.js"); 
const Post = require("./Post.js"); 

const [DOWNVOTE, NOVOTE, UPVOTE] = [-1, 0, +1];

const VoteSchema = new Schema({
    user: { type: mongoose.ObjectId, ref: User},
    post: { type: mongoose.ObjectId, ref: Post},
    value: { type: Number, enum: [DOWNVOTE, NOVOTE, UPVOTE]}
})

const Vote = mongoose.model('Vote', VoteSchema); 
console.log(Vote); 
module.exports = Vote; 