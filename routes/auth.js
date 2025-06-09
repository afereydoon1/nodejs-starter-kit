const express = require('express');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const _ = require('lodash');
const { User } = require('../models/user');

const router = express.Router();

//login user
router.post('/', async (req, res) => {
  // Validate user input
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // Check if user exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid username or password');

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid username or password');

  try {
    const token = user.genereateAuthToken()
    // Send token and user info (without password)
    return res.send({
      token,
      user: _.pick(user, ['_id', 'name', 'email'])
    });

  } catch (err) {
    console.error('JWT generation error:', err.message);
    return res.status(500).send('Something went wrong during login.');
  }
});

// Joi validation
function validate(req) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return schema.validate(req);
}

module.exports = router;
