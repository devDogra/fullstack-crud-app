function canCreatePost(newPostData, user) {
  if (newPostData.author == user._id) return true;
  return false;
}
function canModifyPost(postId, user) {
  if (postId == user._id) return true;
  return false;
}

module.exports = {
  canCreatePost,
  canModifyPost,
};
