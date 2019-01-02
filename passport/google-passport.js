const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

const User = require('./../models/user.js');

const keys = require('./../config/keys.js');

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new GoogleStrategy({
    clientID: keys.GoogleClientID,
    clientSecret: keys.GoogleClientSecret,
    callbackURL: "/auth/google/callback",
    proxy: true
  },
  function(accessToken, refreshToken, profile, done) {
    // User.findOrCreate({ googleId: profile.id }, function (err, user) {
    //   return cb(err, user);
    // });
    // console.log(profile);
    User
        .findOne({
            google: profile.id
        })
        .then((user)=>{
            if(user){
                done(null,user);
            }else{
                const newUser = {
                    google: profile.id,
                    fullname : profile.displayName,
                    firstName: profile.name.givenName,
                    lastName : profile.name.familyName,
                    email : profile.emails[0].value,
                    image : profile.photos[0].value.substring(0,profile.photos[0].value.indexOf('?'))
                }
                //save newUser to db.
                new User(newUser).save().then((user)=>{
                    done(null,user);
                })
            }
        })
        .catch(function(err){
            console.log(err);
        })


  }
));