const express = require('express');
const dotenv = require('dotenv');
const notifyRoutes = require('./routes/notify');

dotenv.config();
console.log('SMTP Config:', {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS ? '[REDACTED]' : undefined,
    portApp: process.env.PORT
  });
const app = express();

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
app.use(express.json());
app.get('/debug', (req, res) => res.json({ status: 'Notification service OK' }));

app.use('/api/notify', notifyRoutes);

module.exports = app;



// const express = require('express');
// const dotenv = require('dotenv');
// const notifyRoutes = require('./routes/notify');

// dotenv.config();
// const app = express();
// app.use(express.json());
// app.use('/api/notify', notifyRoutes);

// const PORT = process.env.PORT || 3003;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));