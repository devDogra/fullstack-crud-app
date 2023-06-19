const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");

const apiurl = "http://127.0.0.1:8443";

router.post("/", passport.authenticate("local"), async (req, res, next) => {
  // Passport will set req.user to the authenticated user on succesful authentication

  const authSuccesful = req.user ? true : false;

  if (authSuccesful) {
    try {
      const url = apiurl + "/users";
      res.send("succesful");
    } catch (err) {
      return next(err);
    }
  } else {
    res.send("not succesful");
  }
});

module.exports = router;
