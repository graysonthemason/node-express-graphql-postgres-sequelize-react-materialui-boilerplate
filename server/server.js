/* eslint-disable camelcase */
/* eslint-disable no-console */
import {
  ApolloServer
} from 'apollo-server-express';

import express from 'express';
import cloudinary from 'cloudinary';
import cors from 'cors';
import session from 'express-session';
import pg from 'pg';
import passport from 'passport';
import cookieParser from 'cookie-parser';

require('dotenv').config();
require('babel-polyfill');

const PgSession = require('connect-pg-simple')(session);
const webpackMiddleware = require('webpack-dev-middleware');
const webpack = require('webpack');
const devWebpackConfig = require('../webpack.dev.config.js');

const schema = require('./schema/schema'); // graphql schema
const database = require('./models/index'); // sequelize schema

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
const generateRandomString = (length) => {
  let text = '';
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i += 1) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

// Authenticate and sync Sequelize schema
database
  .authenticate()
  .then(() => {
    console.log('Sequelize connection has been established successfully.'.bold.blue);
  })
  .catch(err => {
    console.error('Unable to connect to the database:'.bold.red, err);
  });

if (process.env.DB_SYNC) {
  database.sync({
    alter: true,
    force: process.env.FORCE_SYNC === "true"
  }).then(() => {
    console.log("Database synced with Sequelize models".bold.blue)
  }).catch(err => {
    console.error('Unable to sync the database with Sequelize models:'.bold.red, err);
  });
}

const {
  Pool
} = pg;

const DATABASE_URL = process.env.TEST_DATABASE_URL || process.env.DATABASE_URL

// Connect Postgresql (use pool instead of client to avoid individual 
// ssl handshakes and individual db connections per user)
const pool = new Pool({
  connectionString: DATABASE_URL,
})

pool.connect()
  .then(() => console.log(`Connected to Postgres instance at ${DATABASE_URL}`.bold.blue))
  .catch(e => console.error('Error connecting to Postgres:', e.stack))

// Create a new Express application
const app = express();

app.use(cors())
  .use(cookieParser());

// Configures express to use sessions via PgSession.
app.use(session({
  store: new PgSession(),
  secret: 'aaabbbccc',
  resave: true,
  saveUninitialized: true,
  cookie: {
    maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
  }
}));

// Endpoint to check if the API is running
app.get('/api/status', (req, res) => {
  res.send({
    status: 'ok'
  });
});

// config cloudinary for image/video management
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// Passport wired into express as a middleware. When a request comes in,
// Passport will examine the request's session and assign the current user 
// to the 'req.user' object.  See also services/auth.js
app.use(passport.initialize());
app.use(passport.session());

const server = new ApolloServer(schema);
server.applyMiddleware({
  app
});

// Running webpack as a middleware if in dev.  If any request comes in for the root route ('/')
// Webpack will respond with the output of the webpack process: an HTML file and
// a single bundle.js output of all client side Javascript
// Otherwise, serve static dist files

if (process.env.NODE_ENV === "development") {
  app.use(webpackMiddleware(webpack(devWebpackConfig)));
} else {
  app.use(express.static("dist"));
}



module.exports = app;
