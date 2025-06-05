const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

// Verify connection
console.log('Sequelize instance in model:', sequelize.constructor.name);

const HealthRecord = sequelize.define('HealthRecord', {
  petName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  vaccine: {
    type: DataTypes.STRING,
    allowNull: false
  },
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  }
});

module.exports = HealthRecord;