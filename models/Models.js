const mongoose = require('mongoose'); 
const UserSchema = require('./User'); 
const PostSchema = require('./Post'); 

const User = mongoose.model('User', UserSchema);
const Post = mongoose.model('Post', PostSchema);

module.exports = {
    User,
    Post,
}
