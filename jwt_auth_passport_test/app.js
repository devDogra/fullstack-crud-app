const express = require("express");
const session = require("express-session");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const initPassport = require("./init-passport");
// const nanoid = require("nanoid").nanoid;
// import { nanoid } from "nanoid";
const { v4: uuidv4 } = require("uuid");
const app = express();

app.use(cors());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PVT_KEY = "keyboard cat";
const users = [];

initPassport(PVT_KEY, users);

app.post("/register", (req, res, next) => {
  const { email, password } = req.body;
  const id = uuidv4();
  const usr = { email, password, id };
  users.push(usr);
  res.status(200).send({ message: "User created", usr });
});

app.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  const claimedUser = users.find((u) => u.email === email);
  if (password == claimedUser.password) {
    // Then login credentials are OK
    // Log the user in
    const payload = { sub: claimedUser.id }; // serialize
    jwt.sign(payload, PVT_KEY, function (err, token) {
      // token is a signed one
      res.json({ token });
    });
  } else {
    res.json({ error: "Invalid credentials" });
  }
});

app.get(
  "/protected",
  passport.authenticate("jwt", { session: false }),
  (req, res, next) => {
    // come here if the authentication succesful
    const usr = req.user; // made available by passport, the usr who it is
    res.status(200).json({
      message: "GOT IN",
      user: usr,
    });
  }
);

const port = 8443;
app.listen(port, () => {
  console.log("Server: http://localhost:8443");
});
