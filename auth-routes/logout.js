const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");

const apiurl = "http://127.0.0.1:8443";

router.post("/", passport.authenticate("local"), async (req, res, next) => {
  // Passport will set req.user to the authenticated user on succesful authentication
  const isLoggedIn = req.user ? true : false;
  console.log({ page: "logout", isLoggedIn });
  if (isLoggedIn) {
    req.logout(function (err) {
      if (err) return next(err);
      res.send("succesful");
    });
  } else {
    res.send("already logged out");
  }
});

module.exports = router;
