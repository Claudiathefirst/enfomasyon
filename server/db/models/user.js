const crypto = require('crypto');
const Sequelize = require('sequelize');
const db = require('../db');

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  email: {
    type: Sequelize.STRING,
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
      notEmpty: true,
    },
  },
  //sequelize hooks and crypto to encrypt passwords
  password: {
    type: Sequelize.STRING,
    // Making `.password` act like a func hides it when serializing to JSON.
    validate: {
      notEmpty: true,
      len: [8, 64],
    },
    //tell Sequelize to treat those rows as functions instead of variables, preventing them from showing up on queries
    get() {
      return () => this.getDataValue('password'); //salt is a unique encryption key used to dynamically encrypt the users password
    },
  },
  salt: {
    type: Sequelize.STRING,
    get() {
      return () => this.getDataValue('salt');
    },
  },
});
//Instance Methods
User.prototype.correctPassword = function (enteredPassword) {
  return User.encryptPassword(enteredPassword, this.salt()) === this.password();
};

// Class Methods
User.generateSalt = function () {
  return crypto.randomBytes(16).toString('base64');
};
User.encryptPassword = function (plainText, salt) {
  return crypto
    .createHash('RSA-SHA256')
    .update(plainText)
    .update(salt)
    .digest('hex');
};

// Hooks
//Every time a user row is created or a password is updated, a new salt will be generated and the password will be automatically encrypted.
const setSaltAndPassword = (user) => {
  if (user.changed('password')) {
    user.salt = User.generateSalt();
    user.password = User.encryptPassword(user.password(), user.salt());
  }
};
User.beforeCreate(setSaltAndPassword);
User.beforeUpdate(setSaltAndPassword);
User.beforeBulkCreate((users) => {
  users.forEach(setSaltAndPassword);
});
// Return true if the entered password encrypts to the same value as the saved password
module.exports = User;
