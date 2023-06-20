const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");

const apiurl = "http://127.0.0.1:8443";

function checkLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return res.send("already logged in");
  }
  return res.send("not logged in");
}
// Expose this GET endpoint for just checking if logged in
router.get("/", checkLoggedIn);
function getAuthChecker(onLoggedIn, onLoggedOut) {
  return function authChecker(req, res, next) {
    if (req.isAuthenticated()) {
      return onLoggedIn();
    }
    return onLoggedOut();
  };
}

getAuthChecker(
  () => res.send("already logged in"),
  () => res.send("not logged in")
);

// But before authenticating, if a logged in user is POSTing, I want to deal with this
function proceedIfLoggedOut(req, res, next) {
  if (req.isAuthenticated()) {
    return res.send("successful");
  }
  return next();
}
// On submitting the login form, authenticate.
router.post(
  "/",
  proceedIfLoggedOut,
  passport.authenticate("local"),
  async (req, res, next) => {
    // Passport will set req.user to the authenticated user on succesful authentication
    const authSuccesful = req.user ? true : false;
    console.log({
      page: "login",
      authSuccesful,
    });

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
  }
);

module.exports = router;
