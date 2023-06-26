const passport = require("passport");
const mongoose = require("mongoose");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = mongoose.model("User");

function configurePassport(SECRET_KEY) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = SECRET_KEY;
  opts.passReqToCallback = true;

  async function verify(req, jwt_payload, done) {
    const id = jwt_payload.sub;
    try {
      const user = await User.findById(id);
      if (!user) return done(null, false);

      // Make the user available on req
      // Now any route that has the passport.authenticate("jwt", {session: false})
      // middleware will receive req.user upon successful authentication.
      req.user = user;
      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }

  passport.use(new JwtStrategy(opts, verify));
}

module.exports = configurePassport;
