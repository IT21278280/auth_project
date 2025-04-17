const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const User = require('../models/User');

// Register a new user
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({
      username,
      email,
      password: hashedPassword,
    });
    await user.save();

    // // Send notification to notification microservice
    // try {
    //   await axios.post('http://notification:3003/api/notify', { // Update to 'notification:3003' for Docker Compose later
    //     userId: user._id,
    //     message: `Welcome to the app, ${username}!`,
    //     email: user.email,
    //   }, { family: 4 }); // Force IPv4
    // } catch (notifyError) {
    //   console.error('Failed to send notification:', notifyError.message);
    // }

    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { id: user._id, username: user.username }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Login user (unchanged)
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );

    res.json({ 
      message: 'Login successful', 
      user: { id: user._id, username: user.username },
      token 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;






// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken'); // Added for JWT
// const axios = require('axios'); // Added for notification integration
// const User = require('../models/User');

// // Register a new user
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;

//   // Validate input
//   if (!username || !email || !password) {
//     return res.status(400).json({ message: 'Username, email, and password are required' });
//   }

//   try {
//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: 'User already exists' });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     user = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });
//     await user.save();

//     // Send notification to notification microservice
//     try {
//       await axios.post('http://localhost:3003/api/notify', { // Use service name for Docker networking later
//         userId: user._id,
//         message: `Welcome to the app, ${username}!`
//       });
//     } catch (notifyError) {
//       console.error('Failed to send notification:', notifyError.message);
//       // Don’t fail registration if notification fails
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

// // Login user
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;

//   // Validate input
//   if (!email || !password) {
//     return res.status(400).json({ message: 'Email and password are required' });
//   }

//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     // Verify password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     // Generate JWT token
//     const token = jwt.sign(
//       { id: user._id, username: user.username },
//       'your_jwt_secret', // Replace with a strong secret (store in .env later)
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




// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const User = require('../models/User');

// // Register a new user
// router.post('/register', async (req, res) => {
//   const { username, email, password } = req.body;
//   try {
//     // Check if user exists
//     let user = await User.findOne({ email });
//     if (user) return res.status(400).json({ message: 'User already exists' });

//     // Hash password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(password, salt);

//     // Create new user
//     user = new User({
//       username,
//       email,
//       password: hashedPassword,
//     });
//     await user.save();

//     res.status(201).json({ message: 'User registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// // Login user
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   try {
//     // Check if user exists
//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: 'Invalid credentials' });

//     // Verify password
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     res.json({ message: 'Login successful', user: { id: user._id, username: user.username } });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error', error });
//   }
// });

// module.exports = router;