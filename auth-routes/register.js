const router = require("express").Router();
const axios = require("axios");
const passport = require("passport");

const apiurl = "http://127.0.0.1:8443";

router.post("/", async (req, res, next) => {
  if (req.isAuthenticated()) {
    return res
      .status(403)
      .json({ error: "Logged in users are not allowed to register" });
  }

  try {
    const url = apiurl + "/users";
    const { data: createdUser } = await axios.post(url, req.body);
    return res.status(201).json({ message: "Success" });
  } catch (err) {
    return next(err);
  }
});

module.exports = router;
