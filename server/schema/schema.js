import cors from 'cors';
import depthLimit from 'graphql-depth-limit'

const path = require('path');
const {
  fileLoader,
  mergeTypes,
  mergeResolvers
} = require('merge-graphql-schemas');

const {
  models
} = require('../models/index'); // sequelize schema

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './types')));

const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const whitelist = [`https://localhost:${process.env.PORT}`, `https://localhost:3000`, `http://localhost:${process.env.PORT}`, `http://localhost:3000`]
const corsOptions = {
  origin: (origin, callback) => {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Restricted'))
    }
  },
  credentials: true // <-- REQUIRED backend setting
};

module.exports = {
  typeDefs,
  resolvers,
  introspection: true,
  cors: cors(corsOptions),
  validationRules: [depthLimit(10)], // protect against depth attack
  context: ({
    req
  }) => {
    const {
      account,
      user
    } = req;
    if (!user) console.warn(`Request coming from logged out session`.bold.yellow);
    return ({
      models,
      user,
      req
    })
  }
};
