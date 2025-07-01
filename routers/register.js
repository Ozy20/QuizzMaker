const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const userValidator = require('../middlewares/userValidator');

if (!config.get("jwtsec")) {
    console.log("");
    process.exit(0);
}

router.post('/', userValidator, async (req, res) => {
    try {
        const { name, email, userName, password, userRole } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "This user already exists" });
        }

        const existingUserName = await User.findOne({ userName });
        if (existingUserName) {
            return res.status(400).json({ error: "This username is already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name,
            email,
            userName,
            password: hashedPassword,
            userRole: userRole || "teacher",
            createdQuizzes: [],
            attemptedQuizzes: []
        });

        if (!newUser) {
            return res.status(500).json({ error: "Something went wrong while creating user" });
        }

        return res.status(201).json({
            message: "User registered successfully",
        });
    }
    catch (err) {
        console.error("Error in registration:", err);
        return res.status(500).json({ error: "Something went wrong while registration" });
    }
});

module.exports = router;

