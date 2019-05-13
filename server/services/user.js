const database = require('../database');

const User = database.import('../models/user')



function updateUser(args, reject) {
  if (!args.id) {
    reject('You must provide an id');
  }

  return User.findOne({
    where: {
      id: args.id
    }
  }).then(user => {
    const saveObj = user;
    Object.keys(args).forEach((key) => {
      if (key !== "id") {
        saveObj[key] = args[key]
      }
    })
    if (args.userConfigOptions) {
      return saveObj.setConfigOptions(args.userConfigOptions).then(() => {
        saveObj.save();
      })
    }
    return saveObj.save();
  }).catch(e => {
    reject(e);
  })
}

function createUser(args, reject) {
  if (!args.email) {
    reject('You must provide an email');
  }

  return User.create(args).then(user => user).catch(e => {
    reject(e);
  })
}

module.exports = {
  updateUser,
  createUser
};
