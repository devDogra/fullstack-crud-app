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

PostSchema.statics.voteOnPost = async function(postId, savedVote) {
  const votedPost = await this.findById(postId);
  const voteCountPropertyName = (savedVote.value == 1) ? 'upvoteCount' : 'downvoteCount';
  votedPost[voteCountPropertyName]++;

  votedPost.votes.push(savedVote._id);
  await votedPost.save(); 
}

PostSchema.statics.updateVoteOnPost = async function(postId, savedVote) {
  const votedPost = await this.findById(postId);
  const voteCountPropertyName = (savedVote.value == 1) ? 'upvoteCount' : 'downvoteCount';
  const otherVoteCountPropertyName = (savedVote.value == 1) ? 'downvoteCount' : 'upvoteCount';

  votedPost[voteCountPropertyName]++;
  votedPost[otherVoteCountPropertyName]--;
  console.log(votedPost.votes); 
  console.log({savedVote}); 
  const idx = votedPost.votes.findIndex(vote =>  vote.toString() == savedVote._id.toString() );
  console.log({idx}); 
  if (idx == -1) return ({ error: "Vote does not exist in Post's votes array", status: 404});
  votedPost.votes[idx].value = savedVote.value;
  await votedPost.save();   
  return ({message: "Success"});
}

PostSchema.statics.deleteVoteOnPost = async function(postId, voteToDelete) {
  const votedPost = await this.findById(postId);
  const voteCountPropertyName = (voteToDelete.value == 1) ? 'upvoteCount' : 'downvoteCount';
  votedPost[voteCountPropertyName]--;

  votedPost.votes = votedPost.votes.filter(vote => vote.toString() != voteToDelete.toString());
  await votedPost.save();
  return ({message: "Success"});
}


module.exports = PostSchema;
