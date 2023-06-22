const passport = require("passport");

const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

function initPassport(SECRET_KEY, users) {
  const opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
  opts.secretOrKey = SECRET_KEY;

  // . means seperation like IP addresses here, not object membership
  // Token = header.payload.signed(header.payload)
  // When server gets a token, it unsigns the signed(header.payload) to get a header and payload
  // If the extracted header.payload matches the header.payload sent along with the server
  // Then the server knows that this token was signed by it
  // And since the sender was issued a token signed by the server, the sender is allowed access
  // Cuz that means the sender once DID log in otherwise he wouldn't have been able to get a signed token
  // PROB1: Token could be stolen/copied and sent by a malicious guy and he'd get access
  // PROB2: Token payload is not encrypted (it's just encoded in Base64, easily visible throghout the
  //   travel path to the server)
  function verify(jwt_payload, done) {
    // sub is the id (we serialized the user during login remember?)
    // User.findOne({ id: jwt_payload.sub }, function (err, user) {
    //   if (err) {
    //     return done(err, false);
    //   }
    //   if (user) {
    //     return done(null, user);
    //   } else {
    //     return done(null, false);
    //     // or you could create a new account
    //   }
    // });
    const id = jwt_payload.sub;
    const usr = users.find((u) => u.id == id);
    const err = undefined;
    // if any error, throw it
    if (err) return done(err);
    if (!usr) return done(null, false);
    return done(null, usr);
  }
  passport.use(new JwtStrategy(opts, verify));
}

module.exports = initPassport;
