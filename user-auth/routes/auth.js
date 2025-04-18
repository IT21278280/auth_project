const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const axios = require('axios');

router.post(
  '/register',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, email, password } = req.body;

    try {
      let user = await User.findOne({ $or: [{ username }, { email }] });
      if (user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      user = new User({ username, email, password });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      await user.save();

      // Send notification
      try {
        await axios.post('http://notification:3003/api/notify', {
          userId: user._id,
          email,
          message: `Welcome, ${username}! Your account has been created.`,
        }, { family: 4 });
      } catch (notifyError) {
        console.error('Failed to send notification:', notifyError.message);
      }

      res.status(201).json({
        user: { id: user._id, username, email },
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

router.post(
  '/login',
  [
    body('username').notEmpty().withMessage('Username is required'),
    body('password').notEmpty().withMessage('Password is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password } = req.body;

    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      const payload = { user: { id: user._id } };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const axios = require('axios');
// const User = require('../models/User');

// // Register a new user
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   if (!username || !email || !password) {
//     return res.status(400).json({ message: 'Username, email, and password are required' });
//   }

//   try {
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: 'User already exists' });

//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     user = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });
//     await user.save();

//     // Send notification to notification microservice
//     try {
//       await axios.post('http://notification:3003/api/notify', { // Update to 'notification:3003' for Docker Compose later
//         userId: user._id,
//         message: `Welcome to the app, ${username}!`,
//         email: user.email,
//       }, { family: 4 }); // Force IPv4
//     } catch (notifyError) {
//       console.error('Failed to send notification:', notifyError.message);
//     }

//     res.status(201).json({ 
//       message: 'User registered successfully', 
//       user: { id: user._id, username: user.username }
//     });
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// // Login user (unchanged)
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   try {
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     const token = jwt.sign(
//       { id: user._id, username: user.username },
//       process.env.JWT_SECRET || 'your_jwt_secret',
//       { expiresIn: '1h' }
//     );

//     res.json({ 
//       message: 'Login successful', 
//       user: { id: user._id, username: user.username },
//       token 
//     });
//   } catch (error) {
//     console.error('Login error:', error);
//     res.status(500).json({ message: 'Server error', error: error.message });
//   }
// });

// module.exports = router;


