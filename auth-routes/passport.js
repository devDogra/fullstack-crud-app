const passport = require("passport");
const mongoose = require("mongoose");
const LocalStrategy = require("passport-local").Strategy;

passport.use(
  "local",
  new LocalStrategy(
    {
      usernameField: "email",
    },
    verify
  )
);

// You ask how it is certain that user will have the _id field?
// Well, a user trying to get authenticated will be registered in the DB, of course

passport.serializeUser(function (user, done) {
  return done(null, user._id);
});
passport.deserializeUser(async function (id, done) {
  try {
    const user = await mongoose.model("User").findById(id);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
});

async function verify(username, password, done) {
  const user = await mongoose.model("User").findOne({ email: username });
  try {
    if (!user) return done(null, false);
    if (password != user.password) return done(null, false);
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}

module.exports = passport;
