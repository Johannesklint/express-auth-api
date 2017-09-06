const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');

// Create local strategy
const localLogin = new LocalStrategy({ usernameField: 'email' }, function (email, password, done) {
    // Verify this email and pswrd and call 'done', with the user
    // if its the correct
    // otherwise call 'done' with false
    User.findOne({ email: email }, function (err, user) {
        if (err) { return done(err); }
        if (!user) { return done(null, false); }

        // compare passwords - is 'password' equal to user.password?
        user.comparePassword(password, function (err, isMatch) {
            if (err) {
                return done(err);
            }
            if (!isMatch) {
                return done(null, false);
            }
            return done(null, user);
        });
    });
});

// Set up options for JWT strategy
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

// Create JWT strategy
const JWTLogin = new JWTStrategy(jwtOptions, function (payload, done) {
    // See if the user id in the payload exist in our database
    // If it does, call 'done' with that user
    // otherwise call 'done' with a user object
    User.findById(payload.sub, function (err, user) {
        if (err) { return done(err, false); }

        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
});

// Tell passport to use this strategy
passport.use(JWTLogin);
passport.use(localLogin);