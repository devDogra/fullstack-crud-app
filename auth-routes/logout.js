const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");

const apiurl = "http://127.0.0.1:8443";

router.post("/", passport.authenticate("local"), async (req, res, next) => {
  if (req.isAuthenticated()) {
    req.logout(function (err) {
      if (err) return next(err);
      res.status(200).json({ message: "Logout successful." });
    });
  } else {
    return res.status(200).json({ message: "User is already logged out." });
  }
});

module.exports = router;
