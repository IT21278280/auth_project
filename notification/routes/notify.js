const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const { body, validationResult } = require('express-validator');
const dotenv = require('dotenv');

dotenv.config({ path: './.env' });
console.log('Initializing notify routes');
console.log('SMTP Auth:', {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? '[REDACTED]' : undefined
});
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});

router.post(
    '/',
    [
        body('userId').notEmpty().withMessage('userId is required'),
        body('message').trim().notEmpty().withMessage('Message is required'),
        body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
    ],
    async (req, res) => {
        console.log('Received POST /api/notify request:', req.body);
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { userId, message, email } = req.body;

        try {
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
    }
);

console.log('Notify routes defined');
module.exports = router;



// const express = require('express');
// const router = express.Router();
// const nodemailer = require('nodemailer');
// const { body, validationResult } = require('express-validator');

// console.log('SMTP Auth:', {
//   user: process.env.SMTP_USER,
//   pass: process.env.SMTP_PASS ? '[REDACTED]' : undefined
// });
// const transporter = nodemailer.createTransport({
//   // host: process.env.SMTP_HOST,
//   // port: process.env.SMTP_PORT,
//   host: process.env.SMTP_HOST || 'smtp.gmail.com',
//   port: parseInt(process.env.SMTP_PORT) || 587,
//   secure: false,
//   auth: {
//     user: process.env.SMTP_USER || 'rpfernando1999@gmail.com',
//     pass: process.env.SMTP_PASS || 'ipwm psfs kooj wthl',
//   },
// });

// router.post(
//   '/',
//   [
//     body('userId').notEmpty().withMessage('userId is required'),
//     body('message').trim().notEmpty().withMessage('Message is required'),
//     body('email').isEmail().normalizeEmail().withMessage('Invalid email'),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { userId, message, email } = req.body;

//     try {
//       await transporter.sendMail({
//         from: `"App Notification" <${process.env.SMTP_USER}>`,
//         to: email,
//         subject: 'Welcome to the App!',
//         text: message,
//         html: `<p>${message}</p>`,
//       });

//       console.log(`Email sent to ${email} for user ${userId}: ${message}`);
//       res.json({ message: 'Email notification sent successfully' });
//     } catch (error) {
//       console.error(`Failed to send email to ${email}:`, error.message);
//       res.status(500).json({ error: 'Failed to send email', details: error.message });
//     }
//   }
// );

// module.exports = router;





