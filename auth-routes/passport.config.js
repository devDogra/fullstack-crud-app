const passport = require("passport");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = mongoose.model("User");

function configurePassport(SECRET_KEY) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = SECRET_KEY;

  async function verify(jwt_payload, done) {
    const id = jwt_payload.sub;
    try {
      const user = User.findById(id);
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }

  passport.use(new JwtStrategy(opts, verify));
}

module.exports = configurePassport;
