const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const Post = require('./Post.js');
const User = require('./User.js');

const UPVOTED = +1; 
const DOWNVOTED = -1;
const NOTVOTED = 0;

const VoteSchema = new Schema({
    post: { type: mongoose.ObjectId, ref: Post},
    user: { type: mongoose.ObjectId, ref: User},
    value: { type: Number, enum: [DOWNVOTED, NOTVOTED, UPVOTED]}
})


const Vote = mongoose.model('Vote', VoteSchema);
module.exports = Vote; 