const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");

const apiurl = "http://127.0.0.1:8443";

// With JWTs, logging out happens by deleting the token in the local storage at client side
router.post("/", (req, res, next) => {});

module.exports = router;
