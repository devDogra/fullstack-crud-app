const router = require("express").Router();
const mongoose = require("mongoose");
const User = mongoose.model("User");

const passport = require("passport");

// Dont need to authenticate users here, just need to make sure
// they ARE authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    return res.status(403).json({ error: "User not authenticated" });
  }
}

router.get("/", ensureAuthenticated, async (req, res, next) => {
  const users = await User.find();
  res.status(200).json(users);
});

router.get("/:userId", ensureAuthenticated, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.status(400).json({ error: "Invalid ID" });
  }

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ error: "User not found" });
    return res.status(200).json(user);
  } catch (err) {
    return next(err);
  }
});

// Dont need to ensure authenticated here cuz new users MUST
// be able to register accounts
router.post("/", async (req, res, next) => {
  const userData = req.body;
  try {
    const createdUser = await User.create(userData);
    res.status(201).json({ createdUser, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

// Working
router.patch("/:userId", ensureAuthenticated, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) return res.json();
  const data = req.body;
  try {
    const user = await User.findById(req.params.userId);
    const updatedUser = Object.assign(user, data);
    await updatedUser.save();
    res.status(200).json({ updatedUser, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

router.put("/:userId", ensureAuthenticated, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) return res.json();
  const data = req.body;

  try {
    await User.validate(data);
  } catch (err) {
    return next(err);
  }

  try {
    let user = await User.findById(req.params.userId);
    user = Object.assign(user, data);
    user.save();
    res.status(200).json({ updatedUser, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

router.delete("/:userId", ensureAuthenticated, async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) return res.json();

  const id = req.params.userId;
  try {
    const deletedUser = await User.findByIdAndDelete(id);
    res.status(200).json({ deletedUser, message: "Success" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
