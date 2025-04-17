// const express = require('express');
// const router = express.Router();

// router.post('/', (req, res) => {
//   const { userId, message } = req.body;
//   if (!userId || !message) {
//     return res.status(400).json({ error: 'userId and message are required' });
//   }
//   // Simulate sending a notification (e.g., log to console)
//   console.log(`Notification for user ${userId}: ${message}`);
//   res.json({ message: 'Notification sent successfully' });
// });

// module.exports = router;


const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false, // Use TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

router.post('/', async (req, res) => {
  const { userId, message, email } = req.body;
  if (!userId || !message || !email) {
    return res.status(400).json({ error: 'userId, message, and email are required' });
  }

  try {
    // Send email
    await transporter.sendMail({
      from: `"App Notification" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Welcome to the App!',
      text: message,
      html: `<p>${message}</p>`,
    });

    console.log(`Email sent to ${email} for user ${userId}: ${message}`);
    res.json({ message: 'Email notification sent successfully' });
  } catch (error) {
    console.error(`Failed to send email to ${email}:`, error.message);
    res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
});

module.exports = router;