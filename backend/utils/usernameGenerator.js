// Username generator utility

const { User } = require('../models');

// Generate unique username from name
const generateUsername = async (name) => {
  // Remove special characters and spaces, convert to lowercase
  let baseUsername = name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .substring(0, 15);

  let username = baseUsername;
  let counter = 1;

  // Check if username exists, if yes, append number
  while (await User.findOne({ where: { username } })) {
    username = `${baseUsername}${counter}`;
    counter++;
  }

  return username;
};

module.exports = {
  generateUsername
};
