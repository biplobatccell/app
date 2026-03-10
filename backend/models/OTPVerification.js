const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OTPVerification = sequelize.define('OTPVerification', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  identifier: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  otp: {
    type: DataTypes.STRING(6),
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('email', 'mobile', 'login'),
    allowNull: false
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false
  }
}, {
  tableName: 'otp_verifications',
  indexes: [
    { fields: ['identifier', 'type'] },
    { fields: ['expires_at'] }
  ]
});

module.exports = OTPVerification;
