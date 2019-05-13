const passport = require('passport');
const LocalStrategy = require('passport-local');
// const database = require('../database');
const database = require('../models/index');

const User = database.models.user;

// SerializeUser is used to provide some identifying token that can be saved
// in the users session.  We traditionally use the 'ID' for this.
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// The counterpart of 'serializeUser'.  Given only a user's ID, we must return
// the user object.  This object is placed on 'req.user'.
passport.deserializeUser((id, done) => {
  User.findByPk(id).then(user => {
    done(null, user)
  });
});

// Instructs Passport how to authenticate a user using a locally saved email
// and password combination.  This strategy is called whenever a user attempts to
// log in.  We first find the user model in PG that matches the submitted email,
// then check to see if the provided password matches the saved password. There
// are two obvious failure points here: the email might not exist in our DB or
// the password might not match the saved one.  In either case, we call the 'done'
// callback, including a string that messages why the authentication process failed.
// This string is provided back to the GraphQL client.
passport.use('user', new LocalStrategy({
  usernameField: 'email',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({
    where: {
      email: email.toLowerCase()
    }
  }).then(user => {
    if (!user) {
      return done(null, false, `No user associated with email, "${email}"`);
    }
    user.comparePassword(password, async (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
        // await user.getAccounts().then(accounts => {
        // if (accounts.length === 1) {
        //   user.account = accounts[0];
        //   return done(null, user);
        // }
        // if (accounts.length > 1) {
        //   user.account = accounts[0];
        //   return done(null, user);
        // }
        // return done(null, user);
        // })
      }
      return done(null, false, 'Invalid password.');
    });
    return null;
  });
}));

passport.use('account', new LocalStrategy({
  usernameField: 'accountId',
  passReqToCallback: true
}, (req, email, password, done) => {
  User.findOne({
    where: {
      email: email.toLowerCase()
    }
  }).then((user) => {
    if (!user) {
      return done(null, false, `No user associated with email, "${email}"`);
    }
    user.comparePassword(password, async (err, isMatch) => {
      if (err) {
        return done(err);
      }
      if (isMatch) {
        return done(null, user);
        // await user.getAccounts().then(accounts => {
        //   if (accounts.length === 1) {
        //     user.account = accounts[0];
        //     return done(null, user);
        //   }
        //   if (accounts.length > 1) {
        //     user.account = accounts[0];
        //     return done(null, user);
        //   }
        //   return done(null, user);
        // })
      }
      return done(null, false, 'Invalid password.');
    });
    return null;
  });
}));

// Creates a new user account.  We first check to see if a user already exists
// with this email address to avoid making multiple accounts with identical addresses
// If it does not, we save the existing user.  After the user is created, it is
// provided to the 'req.logIn' function.  This is apart of Passport JS.
// Notice the Promise created in the second 'then' statement.  This is done
// because Passport only supports callbacks, while GraphQL only supports promises
// for async code!  Awkward!

function signup({
  email,
  password,
  req
}) {
  const user = new User({
    email,
    password
  });
  if (!email || !password) {
    throw new Error('You must provide an email and password.');
  }

  return User.findOne({
      where: {
        email: email.toLowerCase()
      }
    })
    .then(existingUser => {
      if (existingUser) {
        throw new Error('Email in use');
      }
      return user.save();
    })
    .then(savedUser => new Promise((resolve, reject) => {
      req.logIn(savedUser, (err) => {
        if (err) {
          reject(err);
        }
        resolve(savedUser);
      });
    }));
}

function resetPassword({
  email,
  password,
  token
}) {
  return new Promise((resolve, reject) => {
    if (!email || !password || !token) {
      reject(new Error('You must provide an email and password.'))
    }
    return User.findOne({
        where: {
          email: email.toLowerCase(),
          resetToken: token
        }
      })
      .then(user => {
        if (!user) {
          reject(new Error('This link has become expired or invalid.'));
          return null;
        }
        if (!user.resetExpires || user.resetExpires < new Date()) {
          reject(new Error('This reset password link has expired. Please resend yourself a link by clicking the "Forgot Password" link at login.'));
          return null;
        }
        user.password = password; /* eslint-disable-line no-param-reassign */
        user.resetToken = null; /* eslint-disable-line no-param-reassign */
        user.resetExpires = null; /* eslint-disable-line no-param-reassign */
        return resolve(user.save());
      })
    // .then(savedUser =>
    //   req.logIn(savedUser, (err) => {
    //     if (err) {
    //       reject(err);
    //     }
    //     resolve(savedUser);
    //   })
    // );
  })
}

function confirmEmail({
  email,
  password,
  token,
  req
}) {
  return new Promise((resolve, reject) => {
    if (!email || !password || !token) {
      reject(new Error('You must provide an email and password.'))
    }
    return User.findOne({
        where: {
          email: email.toLowerCase(),
          registerToken: token
        }
      })
      .then(user => {
        if (!user) {
          reject(new Error('This link has become expired or invalid.'));
          return null;
        }
        if (!user.registerExpires || user.registerExpires < new Date()) {
          reject(new Error('This reset password link has expired. Please resend yourself a link by clicking the "Forgot Password" link at login.'));
          return null;
        }
        user.password = password; /* eslint-disable-line no-param-reassign */
        user.registerToken = null; /* eslint-disable-line no-param-reassign */
        user.registerExpires = null; /* eslint-disable-line no-param-reassign */
        user.confirmationDt = new Date(); /* eslint-disable-line no-param-reassign */
        return user.save();
      })
      .then(savedUser => req.logIn(savedUser, (err) => {
        if (err) {
          reject(err);
        }
        resolve(savedUser);
      }))
  })
}

// Logs in a user.  This will invoke the 'local-strategy' defined above in this
// file. Notice the strange method signature here: the 'passport.authenticate'
// function returns a function, as its intended to be used as a middleware with
// Express.  We have another compatibility layer here to make it work nicely with
// GraphQL, as GraphQL always expects to see a promise for handling async code.
function login({
  email,
  password,
  req
}) {
  return new Promise((resolve, reject) => {
    passport.authenticate('user', (err, user, info) => {
      console.log("TESTING", info)
      if (!user) {
        reject(`Invalid credentials.`) // eslint-disable-line prefer-promise-reject-errors
      }
      req.login(user, (err) => {
        return resolve(user)
      });
    })({
      body: {
        email,
        password
      }
    });
  });
}

function spotifyLogin() {
  return new Promise((resolve, reject) => {
    /* eslint-disable-line no-unused-vars */
    const accessToken = "hello world"
    resolve(accessToken)
  });
}


module.exports = {
  signup,
  login,
  resetPassword,
  confirmEmail,
  spotifyLogin
};
