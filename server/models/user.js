const bcrypt = require('bcrypt-nodejs');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      unique: true
    },
    registerToken: DataTypes.STRING,
    registerExpires: DataTypes.DATE,
    resetToken: DataTypes.STRING,
    resetExpires: DataTypes.DATE,
    password: DataTypes.STRING,
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    confirmationDt: DataTypes.DATE,
    profileImgUrl: DataTypes.STRING,
  }, {
    comment: "User instances. Includes guests and/or admins"
  });

  User.beforeCreate((user) => {
    user.password = User.generateHash(user.password); // eslint-disable-line no-param-reassign
  })
  User.beforeUpdate((user) => {
    if (user.changed('password')) {
      user.password = User.generateHash(user.password); /* eslint-disable-line no-param-reassign */
    }
  })

  User.generateHash = (password) => {
    if (!password) return null;
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
  }

  User.associate = (models) => {};

  User.prototype.comparePassword = function comparePassword(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
      cb(err, isMatch);
    });
  };

  return User;
};
