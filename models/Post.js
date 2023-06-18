const mongoose = require('mongoose'); 
const UserSchema = require('./User'); 
const Schema = mongoose.Schema;

const initialWeight = 1000;

const PostSchema = new Schema({
    author: UserSchema,
    content: { type: String, required: true, maxLength: 128},
    weight: { type: Number, default: initialWeight}
})


module.exports = PostSchema;