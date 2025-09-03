// routes/auth.js
const express = require('express');
const jwt = require('jsonwebtoken');
const Officer = require('../models/Officer');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'supersecretkey';

// Officer login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const officer = await Officer.findOne({ username });
    if (!officer) return res.status(401).json({ error: 'Invalid credentials' });
    const isMatch = await officer.comparePassword(password);
    if (!isMatch) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: officer._id, username: officer.username, role: officer.role }, JWT_SECRET, { expiresIn: '8h' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Middleware to protect routes
function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
}

module.exports = { router, authMiddleware };
