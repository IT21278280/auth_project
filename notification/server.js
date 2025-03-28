const express = require('express');
const dotenv = require('dotenv');
const notifyRoutes = require('./routes/notify');

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/notify', notifyRoutes);

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));