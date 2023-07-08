const mongoose = require("mongoose");
const Schema = mongoose.Schema; 

// const {User, Post} = require("./Models.js");
const User = require("./User.js"); 
const Post = require("./Post.js"); 

const DOWNVOTE = -1;
const UPVOTE = +1;

const VoteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: User, unique: false},
    post: { type: Schema.Types.ObjectId, ref: Post, unique: false},
    value: { type: Number, enum: [DOWNVOTE, UPVOTE]}
})

// A vote can only be by 1 user on 1 post
VoteSchema.pre('save', async function(next) {
    const vote = this;
    let {user, post} = vote; 
    user = user.toString(); 
    post = post.toString();
    const match = await Vote.findOne({
        user,
        post
    });
    if (match) return next(new Error("(user, post) must be unique for a Vote"));
    return next();
})


const Vote = mongoose.model('Vote', VoteSchema); 
module.exports = Vote; 