const { Sequelize } = require('sequelize');
require('dotenv').config();

// Initializes our Sequelize ORM instance using your Neon cloud link
const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false, // Keeps your terminal clean from heavy SQL dump logs
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Required for secure cloud connections like Neon
    }
  }
});

module.exports = sequelize;
