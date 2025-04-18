const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const Profile = require('../models/Profile');

// Middleware to verify JWT
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Create/Update Profile
router.post(
  '/',
  [
    auth,
    body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('bio').optional().trim(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, bio } = req.body;

    try {
      let profile = await Profile.findOne({ userId: req.user.id });
      if (profile) {
        // Update existing profile
        profile.firstName = firstName;
        profile.lastName = lastName;
        profile.bio = bio || profile.bio;
        await profile.save();
        return res.json({ profile });
      }

      // Create new profile
      profile = new Profile({
        userId: req.user.id,
        firstName,
        lastName,
        bio,
      });
      await profile.save();
      res.status(201).json({ profile });
    } catch (error) {
      console.error('Profile error:', error.message);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// Get Profile
router.get('/:userId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ profile });
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Delete Profile
router.delete('/:userId', auth, async (req, res) => {
  try {
    const profile = await Profile.findOneAndDelete({ userId: req.params.userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json({ message: 'Profile deleted successfully' });
  } catch (error) {
    console.error('Profile error:', error.message);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;




// const express = require('express');
// const router = express.Router();
// const Profile = require('../models/Profile');

// router.post('/', async (req, res) => {
//   const { userId, name, bio } = req.body;
//   const profile = new Profile({ userId, name, bio });
//   await profile.save();
//   res.json({ message: 'Profile created', profile });
// });

// router.get('/:id', async (req, res) => {
//   const profile = await Profile.findOne({ userId: req.params.id });
//   res.json(profile || { message: 'Profile not found' });
// });

// module.exports = router;