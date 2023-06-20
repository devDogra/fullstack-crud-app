const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");

const apiurl = "http://127.0.0.1:8443";

router.post("/", async (req, res, next) => {
  // do not allow regs while logged in
  const isLoggedIn = req.user ? true : false;
  console.log({
    page: "register",
    isLoggedIn,
  });
  if (isLoggedIn) {
    return res.send({ message: "Logged in users cannot register" });
  }
  try {
    const url = apiurl + "/users";
    const { data: createdUser } = await axios.post(url, req.body);
    console.log(createdUser);
    res.send({ message: "succesful", createdUser });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
