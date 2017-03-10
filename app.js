var express = require('express');
var expressSession = require('express-session');
var user = require('./user');
var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var app = express();
app.use(expressSession({
  secret: '5ECR3T',
  resave: false,
  saveUninitialized: true
}));
app.use(passport.initialize());
app.use(passport.session());

var me = new user('rgagnon', 'password', 1);

passport.use(new GoogleStrategy({
  clientID: '592273938393-rj7pe9jqs6jir2qipou0crfl5d65a307.apps.googleusercontent.com',
  clientSecret: '1gKi_4VA60gbFCE9EBt4yFvy',
  callbackURL: 'http://localhost:3000/oauth2callback'
}, function(token, tokenSecret, profile, done) {
  //could find user
  return done(null, me);
}));

passport.serializeUser(function(user, done) {
    console.log(user);
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    console.log(id);
    done(null, me);
});

app.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

app.get('/oauth2callback', passport.authenticate('google',
    { successRedirect: '/success', failureRedirect: '/failure' }
));

app.get('/', function(req,res) {
  res.json({info: 'Oh hey there.'});
});

app.get('/success', function(req,res) {
  res.json({info: 'You have successfully logged in.'});
});

app.get('/failure', function(req,res) {
  res.json({info: 'You have failed to log in.'});
});

app.get('/securetest',
    ensureAuthenticated,
    function(req, res) {
        res.json({ message: 'Hooray! welcome to our api!' });
    }
);

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.sendStatus(401);
}

app.listen(3000, function() {
  console.log('Server running at http://127.0.0.1:3000/');
});
