const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const models = require("./models/Models.js");
const APIroutes = require("./api/api.js");
const Authroutes = require("./auth-routes/auth-routes.js");
const passport = require("passport");
const configurePassport = require("./auth-routes/passport.config.js");

const secretKey = require("./auth-routes/keys.js").secret;
configurePassport(secretKey);

const port = 8443;
const dburi = "mongodb://127.0.0.1:27017/ocean";

app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ strict: false }));

function printPath(req, res, next) {
  console.log(req.url);
  next();
}

app.use(printPath);
// API Routes
app.use("/users", APIroutes.users);
app.use("/posts", APIroutes.posts);
app.use("/votes", APIroutes.votes); 

// auth routes
app.use("/register", Authroutes.register);
app.use("/login", Authroutes.login);
app.use("/logout", Authroutes.logout);

/* -------------------------------------------------------------------------- */
// Error handler
app.use((err, req, res, next) => {
  console.log("ERROR");
  console.log(err.message);
  res.send(err);
});

async function main() {
  await mongoose.connect(dburi);

  app.listen(port, () => {
    console.log("Server running at http://localhost:8443");
  });
}

main()
  .then()
  .catch((err) => console.error(err));
