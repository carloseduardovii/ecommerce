const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config({ path: './set.env' });

// Create a connection to database
const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB,
  logging: false,
});

module.exports = { db };
