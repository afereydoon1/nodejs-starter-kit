const _ = require("lodash")
const bcrypt = require("bcrypt")
const {validateUser,User} = require("../models/user")
const express = require('express')
const router = express.Router();


router.post('/', async (req, res) => {
    // Validate the input
    const { error } = validateUser(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    // Check if user already exists
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User already registered');

    try {
        user = new User(_.pick(req.body, ['name', 'email', 'password']));
        // Hash the password before saving
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        await user.save();

        return res.status(201).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (err) {
        console.error('Error saving user:', err.message);
        return res.status(500).send('Something went wrong while saving the user.');
    }
});

module.exports = router