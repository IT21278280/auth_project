const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: { user: 'rpfernando1999@gmail.com', pass: 'ipwm psfs kooj wthl' }
});
transporter.sendMail({
    from: 'rpfernando1999@gmail.com',
    to: 'prabodhawith@gmail.com',
    subject: 'Test',
    text: 'Test email'
}).then(() => console.log('Sent')).catch(err => console.error(err));