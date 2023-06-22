const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");

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
router.post("/", async (req, res, next) => {});

module.exports = router;
