const sequelize = require('../config/database');
const User = require('./User');
const Business = require('./Business');
const Category = require('./Category');
const Location = require('./Location');
const OTPVerification = require('./OTPVerification');
const Session = require('./Session');

// Define relationships
User.hasMany(Business, { foreignKey: 'userId', as: 'businesses' });
Business.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Business.belongsTo(Category, { foreignKey: 'categoryId', as: 'category' });
Category.hasMany(Business, { foreignKey: 'categoryId', as: 'businesses' });

Business.belongsTo(Location, { foreignKey: 'locationId', as: 'location' });
Location.hasMany(Business, { foreignKey: 'locationId', as: 'businesses' });

User.hasMany(Session, { foreignKey: 'userId', as: 'sessions' });
Session.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  sequelize,
  User,
  Business,
  Category,
  Location,
  OTPVerification,
  Session
};
