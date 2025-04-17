const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const profileRoutes = require('../routes/profile');

const app = express();
app.use(express.json());
app.use('/api/profile', profileRoutes);

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Profile API', () => {
  it('should get user profile', async () => {
    // Add test based on your profile routes
  });
});