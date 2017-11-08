require('dotenv').config();
const express = require('express')
    , bodyParser = require('body-parser')
    , session = require('express-session')
    , passport = require('passport')
    , Auth0Strategy = require('passport-auth0')
    , cors = require('cors')
    , massive = require('massive');

const app = express();

// login with auth0, store info in session AND in our db

app.use(bodyParser.json());
app.use(cors());

// express-session must be initialized before we can use passport
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true
}))

// set up passport
app.use(passport.initialize());
// when passport gets info from auth0, put it on a session
app.use(passport.session());

// set up db connection
massive({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: true
}).then(db => {
  app.set('db', db);
});

// configure our strategy by calling passport.use
passport.use(new Auth0Strategy({
  domain: process.env.AUTH_DOMAIN,
  clientID: process.env.AUTH_CLIENT_ID,
  clientSecret: process.env.AUTH_CLIENT_SECRET,
  callbackURL: process.env.AUTH_CALLBACK
}, function(accessToken, refreshToken, extraParams, profile, done){
  // if user exists in users table, invoke done with user's id
  // if not, then we will create a new user and invoke done with the new user's id
  const db = app.get('db');
  const userData = profile._json;
  const { name, email, picture } = userData;
  db.find_user([userData.identities[0].user_id]).then(user => {
    // if user exists in db, return its user id
    if (user[0]) {
      return done(null, user[0].id);
    } 
    // else create the user and return its id
    else {
      db.create_user([
        name,
        userData.email,
        picture,
        userData.identities[0].user_id
      ]).then(user => {
        return done(null, user[0].id);
      }).catch(err => console.log(err))
    }
  })
}))

// runs on first login - accessible on each and every endpoint
passport.serializeUser(function(id, done) {
  // hand-off profile to next method, deserializeUser
  done(null, id);
})

// runs on all future logins
// whatever we pass through done will be put on req.user!!!
// THIS IS IMPORTANT ^^^
passport.deserializeUser(function(id, done) {
  // whatever is passed as profile is put onto req.user (could put an arbitrary string)
  const db = app.get('db');
  db.find_session_user([id])
    .then(user => done(null, user[0]));
})

// authenticate -- checks if they're logged in (if not, log them in)
// if they are, use the config object to redirect them (or do something else)
// we have to tell it what strategy to use!

// no one has authenticated when we first hit /auth
// this is where ppl sign into auth0
app.get('/auth', passport.authenticate('auth0'))

// we call the authenticate process again to check if the login
// went well (did we get any data?) then it uses config object
// (2nd argument to authenticate) to do something with user
app.get('/auth/callback', passport.authenticate('auth0', {
  // on success send to front-end view
  successRedirect: 'http://localhost:3000/#/private',
  // if they fail, let them try to login again
  failureRedirect: '/auth'
}))

app.get('/auth/me', (req, res) => {
  if (req.user) {
    return res.status(200).send(req.user);
  } else {
    return res.status(401).send('Please login.');
  }
})

app.get('/logout', (req, res) => {
  // built in method that will destroy our session
  req.logOut();
  // built in method that will re-reoute user with an http status
  res.redirect(308, 'http://localhost:3000/');
})

const PORT = 4200;
app.listen(PORT, console.log(`I'm listening... port: ${PORT}`));