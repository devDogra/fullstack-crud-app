const router = require("express").Router();

const users = [];

router.post("/register", (req, res, next) => {
  const { email, password } = req.body;
  const usr = { email, password };
  users.push(usr);
});
