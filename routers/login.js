const express = require('express');
const router = express.Router();
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const config = require('config');

if (!config.get("jwtsec")) {
  console.log("FATAL ERROR: jwtsec is not defined");
  process.exit(1);
}

//
router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Email and password are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid password." });
    }
    
    const token = user.genAuthToken({ expiresIn: "4h"});
   
    res.status(200).json({
      message: "Login successful",
      token: token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        userName: user.userName,
        userRole: user.userRole,
        createdQuizzes: user.createdQuizzes,
        attemptedQuizzes: user.attemptedQuizzes},
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user");
  }
});

module.exports = router;
