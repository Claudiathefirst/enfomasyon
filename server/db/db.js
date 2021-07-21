const Sequelize = require('sequelize');
const pkg = require('../../ package.json');
const enfomasyon = pkg.name;
const db = new Sequelize(
  process.env.DATABASE_URL || `postgres: // localhost: 5432 / $ {enfomasyon}`,
  {
    logging: false,
  }
);
module.exports = db;
