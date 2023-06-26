const router = require("express").Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = mongoose.model("Post");

async function setPostOnReq(req, res, next) {
  const postId = req.params.postId;
  if (!mongoose.isValidObjectId(postId)) return next();
  try {
    const post = await Post.findById(req.params.postId).populate("author");
    req.post = post;
    next();
  } catch (err) {
    return next(err);
  }
}

function ensureCanCreatePost(req, res, next) {
  const newPost = req.body; 
  const user = req.user; 
  console.log({newPost, user, usrid: user}); 
  if (!canCreatePost(newPost, user)) return res.status(403).json({error: "Not authorised"});
  return next();
}
function canCreatePost(newPost, user) {

  if (newPost.author == user._id.toString()) return true; 
  return false; 
}


function ensureCanModifyPost(req, res, next) {
  const post = req.post; 
  const user = req.user; 
  console.log({post, user});
  if (!canModifyPost(post, user)) return res.status(403).json({error: "Not authorised"});
  next(); 
}
function canModifyPost(post, user) {
  console.log("--------------------------------------------------------------------");
  console.log({authid: post.author._id, uid: user._id});
  const postAuthorId = post.author._id.toString();
  const userId = user._id.toString();
  console.log(postAuthorId, userId);
  console.log(postAuthorId == userId);
  if (postAuthorId == userId) return true;
  // if (post.author._id == user._id) return true; 
  return false; 
}

// Dont need to authenticate users in this function, just need to make sure
// they ARE authenticated
function ensureAuthenticated(req, res, next) {
  passport.authenticate("jwt", { session: false })(req, res, next);
}

router.get("/", ensureAuthenticated, async (req, res, next) => {
  try {
    const posts = await Post.find().populate("author");
    res.status(200).json(posts);
  } catch (err) {
    return next(err);
  }
});

router.get("/:postId", setPostOnReq, ensureAuthenticated, (req, res, next) => {
  const post = req.post;
  if (!post) return res.status(404).json({ error: "Post not found" });
  res.status(200).json(post);
});

router.post("/", ensureAuthenticated, ensureCanCreatePost, async (req, res, next) => {
  const newPost = req.body;
  try {
    const createdPost = await Post.create(newPost);
    res.status(201).json({ createdPost, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

// Has redundant code for now because setPostOnReq also fetches
router.patch("/:postId", setPostOnReq, ensureAuthenticated, ensureCanModifyPost, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.postId)) return res.json();
  const data = req.body;
  try {
    const post = await Post.findById(req.params.postId);
    const updatedPost = Object.assign(post, data);
    updatedPost.save();
    res.status(200).json({ updatedPost, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

// Has redundant code for now because setPostOnReq also fetches
router.put("/:postId", setPostOnReq, ensureAuthenticated, ensureCanModifyPost, (req, res, next) => {console.log("HI"); next()}, async (req, res, next) => {
  console.log({data: req.data, usr: req.user, post: req.post});
  if (!mongoose.isValidObjectId(req.params.postId))  {
    return res.status(404).json({error: "Post not found"});
  }
  const data = req.body;


  try {
    await Post.validate(data);
  } catch (err) {
    return next(err);
  }

  try {
    const post = await Post.findById(req.params.postId);
    const updatedPost = Object.assign(post, data);
    updatedPost.save();
    res.status(200).json({ updatedPost, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

// Has redundant code for now because setPostOnReq also fetches
router.delete("/:postId", setPostOnReq, ensureAuthenticated, ensureCanModifyPost, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.postId)) return res.json();

  try {
    const id = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(id);
    res.json(deletedPost);
    res.status(200).json({ deletedPost, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

/* -------------------------------------------------------------------------- */
/*                      have to test the api for all this                     */
/* -------------------------------------------------------------------------- */
module.exports = router;
