require('dotenv').config();

const Sequelize = require('sequelize');

const sequelize = new Sequelize(process.env.TEST_DATABASE_URL || process.env.DATABASE_URL);

module.exports = sequelize;
