const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Feedback = sequelize.define('Feedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  channel: {
    type: DataTypes.STRING,
    allowNull: false
  },
  sentiment: {
    type: DataTypes.ENUM('POS', 'NEU', 'NEG'),
    defaultValue: 'NEU'
  },
  sentimentScore: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0
  },
  status: {
    type: DataTypes.ENUM('NEW', 'REVIEWED', 'ACTIONED'),
    defaultValue: 'NEW'
  }
});

module.exports = Feedback;
