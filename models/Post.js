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
  votes: { type: [Schema.Types.ObjectId], default: []},
  upvoteCount: { type: Number, default: 0},
  downvoteCount: { type: Number, default: 0},
});

PostSchema.statics.voteOnPost = async function(postId, value) {
  const voteCountPropertyName = (value == 1) ? 'upvoteCount' : 'downvoteCount';
  
  await this.findByIdAndUpdate(postId, {
    $inc: {
        [voteCountPropertyName] : 1
    }
  });
  
}


module.exports = PostSchema;
