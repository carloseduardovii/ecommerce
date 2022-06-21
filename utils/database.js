const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: './set.env' });
const credentials = {
  development: {
    dialect: 'postgres',
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB,
    logging: false,
  },
  production: {
    // host: process.env.DB_HOST,
    // username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    // database: process.env.DB,
    use_env_variable: process.env.DATABASE_URL,
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  },
};
// Create a connection to database
let config = {};

if (process.env.NODE_ENV === 'development') config = credentials.development;
else config = credentials.production;
console.log(config);
const db = new Sequelize(config);

module.exports = { db };
