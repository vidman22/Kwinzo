const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');

passport.use(
	new GoogleStrategy({
	//options
	clientID: keys.google.clientID,
	clientSecret: keys.google.clientSecret
	}, 
	(accessToken, refreshToken, profile, cb) => {
		User.findOrCreate({ googleId: profile.id }, (err, user) => {
      return cb(err, user);
    });
  }
));