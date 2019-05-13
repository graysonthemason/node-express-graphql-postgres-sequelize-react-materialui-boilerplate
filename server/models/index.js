require('dotenv').config();
const database = require('../database');

const models = {
  User: database.import('./user')
}

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

module.exports = database;
