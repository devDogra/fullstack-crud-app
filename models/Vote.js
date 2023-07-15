const mongoose = require("mongoose");
const Schema = mongoose.Schema; 
const DOWNVOTE = -1;
const UPVOTE = +1;

// Should I maintain a NOVOTE value too for caching purposes? 
// No, just gonna take up space right? 
// But updates (downvote -> novote) will be faster... 
const VoteSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: mongoose.model('User')},
    // post: { type: Schema.Types.ObjectId, ref: mongoose.model('Post')},
    post: { type: Schema.Types.ObjectId },
    value: { type: Number, enum: [DOWNVOTE, UPVOTE]}
})

// A vote can only be by 1 user on 1 post
// unique_together(user, post):
VoteSchema.pre('save', async function(next) {
    const vote = this;
    const skip = vote.$locals.skipPreSaveValidation;
    if (skip) return next();
    const Vote = this.constructor;
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


module.exports = VoteSchema; 