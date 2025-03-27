const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');

router.post('/', async (req, res) => {
  const { userId, name, bio } = req.body;
  const profile = new Profile({ userId, name, bio });
  await profile.save();
  res.json({ message: 'Profile created', profile });
});

router.get('/:id', async (req, res) => {
  const profile = await Profile.findOne({ userId: req.params.id });
  res.json(profile || { message: 'Profile not found' });
});

module.exports = router;