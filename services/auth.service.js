// src/services/auth.service.js
const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('../utils/jwt');

exports.register = async ({ email, password }) => {
  const existing = await User.findOne({ email });
  if (existing) throw new Error('User already exists');

  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hashed });
  return { message: 'User created', userId: user._id };
};

exports.login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Error('Invalid credentials');
  }
  const token = jwt.sign({ id: user._id });
  return { token };
};