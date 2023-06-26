const router = require("express").Router();
const mongoose = require("mongoose");
const passport = require("passport");
const Post = mongoose.model("Post");

// Dont need to authenticate users here, just need to make sure
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

router.get("/:postId", ensureAuthenticated, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.postId)) return res.json();

  try {
    const post = await Post.findById(req.params.postId).populate("author");
    res.status(200).json(post);
  } catch (err) {
    return next(err);
  }
});

router.post("/", ensureAuthenticated, async (req, res, next) => {
  const postData = req.body;
  try {
    const createdPost = await Post.create(postData);
    res.status(201).json({ createdPost, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

router.patch("/:postId", ensureAuthenticated, async (req, res, next) => {
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

router.put("/:postId", ensureAuthenticated, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.postId)) return res.json();
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

router.delete("/:postId", ensureAuthenticated, async (req, res, next) => {
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

module.exports = router;
