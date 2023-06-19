const passport = require('passport'); 
const mongoose = require('mongoose'); 
const LocalStrategy = require('passport-local').Strategy; 

passport.use(new LocalStrategy({
    usernameField: 'email'
}, verify));

passport.serializeUser(function(user, done) {
    return done(null, user._id); 
})
passport.deserializeUser(async function(id, done){
    try {
        const user = await mongoose.model('User').findById(id);
        return done(null, user);
    } catch(err) {
        return done(err); 
    }
})

async function verify(username, password, done) {
    const user = await mongoose.model('User').findOne({email: username});
    try {
        if (!user) return done(null, false);
        if (password != user.password) return done(null, false); 
        return done(null, user); 
    } catch(err) {
        return done(err); 
    }
}