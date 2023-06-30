const mongoose = require('mongoose'); 
const Schema = mongoose.Schema; 
const Post = require('./Post.js');
const User = require('./User.js');

const UPVOTED = +1; 
const DOWNVOTED = -1;
const NOTVOTED = 0;

// Not using 'postId' and 'userId' as field names cuz if populate(), fields would sound wrong
const VoteSchema = new Schema({
    post: { type: mongoose.ObjectId, ref: Post},
    user: { type: mongoose.ObjectId, ref: User},
    value: { type: Number, enum: [DOWNVOTED, NOTVOTED, UPVOTED]}
})

VoteSchema.index({ post: 1, user: 1 }, { unique: true });

// Since for a user and a post, there can only be case (either liked/disliked or not voted on), [user | post] should be unique together 
// A vote corresponds to 1 user, voting on 1 post

const Vote = mongoose.model('Vote', VoteSchema);
module.exports = Vote; 