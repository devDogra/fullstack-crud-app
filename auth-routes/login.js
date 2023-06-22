const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");
const mongoose = require("mongoose");
const secretKey = require("./keys.js").secret;
const jwt = require("jsonwebtoken");
const User = mongoose.model("User");

const apiurl = "http://127.0.0.1:8443";

function checkLoggedIn(req, res, next) {
  return next();
}
// Expose this GET endpoint for just checking if logged in. For testing only.
router.get("/", checkLoggedIn);

// But before authenticating, if a logged in user is POSTing, I want to deal with this
function proceedIfLoggedOut(req, res, next) {
  return next();
}
// On submitting the login form, authenticate.
router.post("/", async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res
        .status(401)
        .json({ error: "No account associated with this email" });
    if (user.password !== password)
      return res.status(401).json({ error: "Invalid password" });

    // Valid credentials, send a JWT
    // No need to send the whole user, only the id is fine. Plus this is what we assume in the setup in config of passport anyway
    const payload = { sub: user._id };
    jwt.sign(payload, secretKey, (err, token) => {
      if (err) return next(err);
      // Token is signed token
      return res.status(200).json({ message: "Success", token });
    });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
