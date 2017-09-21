const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const FbStrategy = require('passport-facebook').Strategy;
const User = require('../models/users');
const bcrypt = require('bcrypt');
const dotenv = require ("dotenv").load();



module.exports = function() {
  passport.serializeUser((user, cb) => {
    cb(null, user.id);
  });

  passport.deserializeUser((id, cb) => {

    User.findById(id, (err, user) => {
      if (err) { return cb(err); }
      cb(null, user);
    });
  });

  // passport.use('local-signup', new LocalStrategy(
  //   { passReqToCallback: true },
  //   (req, name, alias, email, password, next) => {
  //     console.log("entrando middleware");
  //     process.nextTick(() => {
  //       User.findOne({
  //         'alias': alias
  //       }, (err, user) =>
  //       { if (err) { return next(err); }
  //         if (user) { return next(null, false); }
  //         else {
  //           const {
  //             name,
  //             alias,
  //             email,
  //             password
  //           } = req.body;
  //           const hashPass = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  //           const newUser = new User({
  //             name,
  //             alias,
  //             email,
  //             password: hashPass,
  //             pick: `/upload/${req.file.filename}`,
  //           });
  //
  //           newUser.save()
  //           .then(result => {
  //             console.log("all done");
  //               return next(null, newUser);
  //         })
  //           .catch(err => console.log(err));
  //
  //
  //         }
  //       });
  //     });
  //   }));

  passport.use('local-login', new LocalStrategy({
    usernameField: 'alias',
    passwordField: 'password'
  }, (alias, password, next) => {
    User.findOne({
      alias
    }, (err, user) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return next(null, false, {
          message: "Incorrect alias"
        });
      }
      if (!bcrypt.compareSync(password, user.password)) {
        return next(null, false, {
          message: "Incorrect password"
        });
      }
      return next(null, user);
    });
  }));
};
passport.use(new FbStrategy({
  clientID: '1929801070619434',
  clientSecret: '5e2c563ea7420d40436a23853e3c59b2',
  callbackURL: "/auth/facebook/callback"
}, (accessToken, refreshToken, profile, next) => {
  console.log(profile);
  User.findOne({ facebookID: profile.id }, (err, user) => {
    if (err) {
      return next(err);
    }
    if (user) {
      return next(null, user);
    }

    const newUser = new User({
      facebookID: profile.id,
      alias: profile.displayName
    });

    newUser.save((err) => {
      if (err) {
        return next(err);
      }
      next(null, newUser);
    });
  });

}));
