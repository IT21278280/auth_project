const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: 'userId and message are required' });
  }
  // Simulate sending a notification (e.g., log to console)
  console.log(`Notification for user ${userId}: ${message}`);
  res.json({ message: 'Notification sent successfully' });
});

module.exports = router;