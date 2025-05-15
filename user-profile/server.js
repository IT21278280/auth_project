const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const profileRoutes = require('./routes/profile');

dotenv.config();

const app = express();

app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

app.use(express.json());





console.log('MONGO_URI:', process.env.MONGO_URI);

const connectWithRetry = async (retries = 5, delay = 5000) => {
  while (retries > 0) {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        connectTimeoutMS: 30000,
        socketTimeoutMS: 30000,
      });
      console.log('MongoDB connected');
      return;
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      retries--;
      if (retries === 0) {
        console.error('MongoDB connection failed after retries');
        process.exit(1);
      }
      console.log(`Retrying connection (${retries} attempts left)...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
};

connectWithRetry();

app.use('/api/profile', profileRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



