const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const axios = require('axios');
const authRoutes = require('../routes/auth');

// Mock axios
jest.mock('axios');

// Create express app
const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('Auth API', () => {
  let mongoServer;

  beforeAll(async () => {
    // Start in-memory MongoDB
    mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  beforeEach(async () => {
    // Clear the database before each test
    const collections = mongoose.connection.collections;
    for (const key in collections) {
      await collections[key].deleteMany({});
    }
    // Mock axios.post to resolve successfully
    axios.post.mockResolvedValue({ status: 200, data: { message: 'Email sent' } });
  });

  afterAll(async () => {
    // Stop in-memory MongoDB and disconnect
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
      });
    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('username', 'testuser');
  });

  it('should fail to register with invalid email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'invalid',
        password: 'test123',
      });
    expect(res.status).toBe(400);
    expect(res.body.errors).toBeDefined();
    expect(res.body.errors[0].msg).toBe('Invalid email');
  });

  it('should fail login with wrong password', async () => {
    // First register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
      });

    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'wrong',
      });
    expect(res.status).toBe(401);
    expect(res.body.message).toBe('Invalid credentials');
  });

  it('should fail to register with existing username', async () => {
    // First register a user
    await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'test123',
      });

    // Try registering with the same username
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'different@example.com',
        password: 'test123',
      });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('User already exists');
  });
});