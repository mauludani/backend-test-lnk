const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const AuthLog = require("../models/AuthLog");

const router = express.Router();

// Register route
router.post("/register", async (req, res) => {
  const { name, email, username, password } = req.body;
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).send("User already exists");
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, username, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// Login route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(400).send('User not found');
      }
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).send('Invalid password');
      }
      const token = jwt.sign({ username, email: user.email ?? '', name: user.name }, process.env.JWT_SECRET, { expiresIn: '1h' });
      
      // Log login action
      const log = new AuthLog({ name: username, action: 'login' });
      await log.save();
  
      res.json({ token, user: { name: user.name ?? '', email: user.email ?? '' } });
    } catch (err) {
      res.status(500).send('Server error');
    }
  });
  

// Middleware to authenticate token
const authenticateToken = (req, res, next) => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).send("Invalid Token");
  }
};

// Protected route example
router.get("/protected", authenticateToken, (req, res) => {
  res.send("This is a protected route");
});

// Logout route
router.post("/logout", authenticateToken, async (req, res) => {
  try {
    // Log logout action
    const log = new AuthLog({ name: req.user.username, action: "logout" });
    await log.save();

    res.send("Logout successful");
  } catch (err) {
    res.status(500).send("Server error");
  }
});

module.exports = router;
