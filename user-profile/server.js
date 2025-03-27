const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const profileRoutes = require('./routes/profile');

dotenv.config();
const app = express();
app.use(express.json());
app.use('/api/profile', profileRoutes);

mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));