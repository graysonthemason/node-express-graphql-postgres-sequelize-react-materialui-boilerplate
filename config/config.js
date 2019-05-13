require('dotenv').config();

module.exports = {
  dialect: "postgres",
  postgres: {
    database: process.env.DATABASE_NAME_TEST,
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD
  },
}
